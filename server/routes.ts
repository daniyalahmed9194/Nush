import type { Express } from "express";
import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// Store connected admin clients
const adminClients = new Set<WebSocket>();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup WebSocket server for real-time notifications
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    console.log("Admin client connected");
    adminClients.add(ws);

    ws.on("close", () => {
      console.log("Admin client disconnected");
      adminClients.delete(ws);
    });
  });

  // Broadcast new order to all connected admin clients
  function broadcastNewOrder(order: any) {
    const message = JSON.stringify({ type: "NEW_ORDER", data: order });
    adminClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  app.get(api.menu.list.path, async (req, res) => {
    const items = await storage.getMenuItems();
    res.json(items);
  });

  app.post(api.contact.create.path, async (req, res) => {
    try {
      const input = api.contact.create.input.parse(req.body);
      const message = await storage.createContactMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Create new order
  app.post(api.orders.create.path, async (req, res) => {
    try {
      console.log("Received order request:", req.body);
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      
      // Broadcast to admin clients
      broadcastNewOrder(order);
      
      res.status(201).json(order);
    } catch (err) {
      console.error("Order creation error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      return res.status(500).json({
        message: err instanceof Error ? err.message : "Failed to create order"
      });
    }
  });

  // Get all orders (for admin)
  app.get(api.orders.list.path, async (req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const order = await storage.updateOrderStatus(orderId, status);
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Seed database without blocking route registration
  seedDatabase().catch(err => {
    console.error("Seed database error:", err);
  });

  return httpServer;
}

async function seedDatabase() {
  const existingItems = await storage.getMenuItems();
  if (existingItems.length > 0) return;

  const items = [
    // Burgers - Beef
    {
      name: "The NUSH Classic",
      description: "Double beef patty, cheddar cheese, lettuce, tomato, special sauce",
      price: 899,
      category: "Burgers",
      subcategory: "Beef",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
    },
    {
      name: "BBQ Bacon Smash",
      description: "Smashed beef patty, crispy bacon, onion rings, BBQ sauce",
      price: 1099,
      category: "Burgers",
      subcategory: "Beef",
      imageUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80"
    },
    // Burgers - Chicken
    {
      name: "Spicy Crispy Chicken",
      description: "Fried chicken breast, spicy mayo, pickles, slaw",
      price: 949,
      category: "Burgers",
      subcategory: "Chicken",
      imageUrl: "https://images.unsplash.com/photo-1615557960916-5f4791effe9d?w=800&q=80"
    },
    {
      name: "Grilled Chicken Deluxe",
      description: "Grilled chicken, avocado, swiss cheese, honey mustard",
      price: 999,
      category: "Burgers",
      subcategory: "Chicken",
      imageUrl: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&q=80"
    },
    // Burgers - Fish
    {
      name: "Fillet-O-NUSH",
      description: "Crispy fish fillet, tartar sauce, cheese",
      price: 849,
      category: "Burgers",
      subcategory: "Fish",
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80"
    },
    // Wraps
    {
      name: "Chicken Caesar Wrap",
      description: "Grilled chicken, romaine lettuce, parmesan, caesar dressing",
      price: 799,
      category: "Wraps",
      subcategory: null,
      imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80"
    },
    {
      name: "Spicy Veggie Wrap",
      description: "Falafel, hummus, spicy relish, fresh veggies",
      price: 749,
      category: "Wraps",
      subcategory: null,
      imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=800&q=80"
    },
    // Fried Chicken
    {
      name: "3pc Fried Chicken",
      description: "Crispy golden fried chicken pieces",
      price: 699,
      category: "Fried Chicken",
      subcategory: null,
      imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80"
    },
    {
      name: "Spicy Wings (6pc)",
      description: "Hot and spicy chicken wings served with ranch",
      price: 799,
      category: "Fried Chicken",
      subcategory: null,
      imageUrl: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80"
    },
    // Sauces
    {
      name: "Signature NUSH Sauce",
      description: "Our secret recipe tangy sauce",
      price: 100,
      category: "Sauces",
      subcategory: null,
      imageUrl: "https://images.unsplash.com/photo-1472476443507-c7a392dd6182?w=800&q=80"
    },
    {
      name: "Garlic Mayo",
      description: "Creamy garlic mayonnaise",
      price: 100,
      category: "Sauces",
      subcategory: null,
      imageUrl: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80"
    },
    // Drinks
    {
      name: "Cola",
      description: "Chilled cola soft drink",
      price: 249,
      category: "Drinks",
      subcategory: null,
      imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80"
    },
    {
      name: "Milkshake",
      description: "Vanilla, Chocolate, or Strawberry",
      price: 499,
      category: "Drinks",
      subcategory: null,
      imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80"
    },
    // Meals
    {
      name: "Family Feast",
      description: "4 Burgers, 4 Fries, 4 Drinks, 6 Wings",
      price: 3499,
      category: "Meals",
      subcategory: null,
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80"
    },
    {
      name: "Couple Combo",
      description: "2 Burgers, 2 Fries, 2 Drinks",
      price: 1899,
      category: "Meals",
      subcategory: null,
      imageUrl: "https://images.unsplash.com/photo-1610614819513-58e34989848b?w=800&q=80"
    }
  ];

  for (const item of items) {
    await storage.createMenuItem(item);
  }
}
