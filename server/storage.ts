import { db } from "./db";
import {
  menuItems,
  contactMessages,
  type MenuItem,
  type InsertMenuItem,
  type InsertContactMessage,
  type ContactMessage
} from "@shared/schema";

export interface IStorage {
  getMenuItems(): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
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
}

export const storage = new DatabaseStorage();
