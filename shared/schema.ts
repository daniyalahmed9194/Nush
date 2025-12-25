import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
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

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true });

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
