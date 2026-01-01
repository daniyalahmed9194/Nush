import { db } from "./db";
import {
  menuItems,
  contactMessages,
  customers,
  orders,
  orderItems,
  type MenuItem,
  type InsertMenuItem,
  type InsertContactMessage,
  type ContactMessage,
  type Customer,
  type InsertCustomer,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type OrderWithDetails,
  type CreateOrderRequest,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getMenuItems(): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  createOrder(orderData: CreateOrderRequest): Promise<OrderWithDetails>;
  getOrders(): Promise<OrderWithDetails[]>;
  updateOrderStatus(orderId: number, status: string): Promise<Order>;
}

export class DatabaseStorage implements IStorage {
  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await db.insert(menuItems).values(item).returning();
    return newItem;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async createOrder(orderData: CreateOrderRequest): Promise<OrderWithDetails> {
    try {
      console.log("Creating order with data:", orderData);
      
      // Create customer
      const [customer] = await db.insert(customers).values(orderData.customer).returning();
      console.log("Customer created:", customer);

      // Create order
      const [order] = await db.insert(orders).values({
        customerId: customer.id,
        totalAmount: orderData.totalAmount,
        status: "pending",
      }).returning();
      console.log("Order created:", order);

      // Create order items
      const orderItemsData = orderData.items.map(item => ({
        orderId: order.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtTime: item.priceAtTime,
      }));

      const createdItems = await db.insert(orderItems).values(orderItemsData).returning();
      console.log("Order items created:", createdItems.length);

      // Fetch menu items for the order
      const itemsWithDetails = await Promise.all(
        createdItems.map(async (item) => {
          const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, item.menuItemId));
          return { ...item, menuItem };
        })
      );

      const result = {
        ...order,
        customer,
        items: itemsWithDetails,
      };
      
      console.log("Order created successfully:", result);
      return result;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getOrders(): Promise<OrderWithDetails[]> {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));

    const ordersWithDetails = await Promise.all(
      allOrders.map(async (order) => {
        const [customer] = await db.select().from(customers).where(eq(customers.id, order.customerId));
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
        
        const itemsWithMenu = await Promise.all(
          items.map(async (item) => {
            const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, item.menuItemId));
            return { ...item, menuItem };
          })
        );

        return {
          ...order,
          customer,
          items: itemsWithMenu,
        };
      })
    );

    return ordersWithDetails;
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();
    return updatedOrder;
  }
}

export const storage = new DatabaseStorage();
