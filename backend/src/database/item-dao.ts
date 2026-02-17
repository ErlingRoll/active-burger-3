import { database } from "../index.js"
import { Item } from "../models/item/item.js"
import { ItemSchema } from "./types/schemas.js"

export class ItemDao {
    static async createItem(item: ItemSchema): Promise<Item> {
        const res = await database
            .from("item")
            .insert(item as ItemSchema)
            .select()
        if (res.error) {
            throw new Error(`Failed to create item: ${res.error.message}`)
        }
        return new Item(res.data![0] as Item)
    }

    static async getItemById(itemId: string): Promise<Item | null> {
        const res = await database.from("item").select("*").eq("id", itemId).single()
        if (res.error) {
            throw new Error(`Failed to get item by ID ${itemId}: ${res.error.message}`)
        }
        return res.data ? new Item(res.data as Item) : null
    }

    static async getItemsByUserId(userId: string): Promise<Item[]> {
        const res = await database.from("item").select("*").eq("user_id", userId)
        if (res.error) {
            throw new Error(`Failed to get items by user ID ${userId}: ${res.error.message}`)
        }
        return res.data ? (res.data as Item[]).map((item) => new Item(item)) : []
    }

    static async updateItem(item: Item): Promise<Item> {
        const res = await database
            .from("item")
            .update(item as ItemSchema)
            .eq("id", item.id)
            .select()
        if (res.error) {
            throw new Error(`Failed to update item with ID ${item.id}: ${res.error.message}`)
        }
        return new Item(res.data![0] as Item)
    }

    static async deleteItem(itemId: string): Promise<void> {
        const res = await database.from("item").delete().eq("id", itemId)
        if (res.error) {
            throw new Error(`Failed to delete item with ID ${itemId}: ${res.error.message}`)
        }
    }
}
