import { database } from "../index.js"

export async function batchUpdate(schema: any, updates: any[], batchSize: number = 10): Promise<void> {
    for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize)
        await database.from(schema).upsert(batch)
    }
}
