import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // stored in cents
  category: text("category").notNull(), // Burgers, Wraps, Fried Chicken, Sauces, Drinks, Meals
  subcategory: text("subcategory"), // Beef, Chicken, Fish (specifically for Burgers)
  imageUrl: text("image_url").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(), // Pakistan phone number
  location: text("location").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  totalAmount: integer("total_amount").notNull(), // in cents
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  menuItemId: integer("menu_item_id").notNull().references(() => menuItems.id),
  quantity: integer("quantity").notNull(),
  priceAtTime: integer("price_at_time").notNull(), // price when ordered, in cents
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });

// Validation schema for Pakistan phone numbers
export const pakistanPhoneSchema = z.string().regex(
  /^(\+92|0)?3[0-9]{9}$/,
  "Invalid Pakistan phone number. Format: 03XXXXXXXXX or +923XXXXXXXXX"
);

// Custom insert schema with validations
export const createOrderRequestSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: pakistanPhoneSchema,
    location: z.string().min(5, "Please provide a detailed location"),
  }),
  items: z.array(z.object({
    menuItemId: z.number().int().positive(),
    quantity: z.number().int().positive(),
    priceAtTime: z.number().int().positive(),
  })).min(1, "Order must contain at least one item"),
  totalAmount: z.number().int().positive(),
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;

// Type for order with customer and items details
export type OrderWithDetails = Order & {
  customer: Customer;
  items: (OrderItem & { menuItem: MenuItem })[];
};
