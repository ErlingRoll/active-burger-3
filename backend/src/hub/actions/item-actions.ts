import { CharacterDao } from "../../database/character-dao.js"
import { ItemDao } from "../../database/item-dao.js"
import { CharacterGenerator } from "../../generators/character/character-generator.js"
import { hub } from "../../index.js"
import { ItemType } from "../../models/constants.js"
import { Item } from "../../models/item/item.js"
import { User } from "../../models/user.js"
import { GameEvent } from "../types.js"

interface UseItemPayload {
    item_id: string
}

export class ItemActions {
    static async useItem({
        clientId,
        user,
        payload,
    }: {
        clientId: string
        user: User
        payload: UseItemPayload
    }): Promise<void> {
        const item = await ItemDao.getItemById(payload.item_id)
        if (!item) {
            hub.sendClientError(clientId, `Item with ID ${payload.item_id} not found.`)
            return
        }

        switch (item.item_type) {
            case ItemType.SOUL_SHARD:
                await this.useSoulShard({ clientId, user, item })
                break
            default:
                hub.sendClientError(clientId, `Item type ${item.item_type} cannot be used.`)
        }
    }

    static async useSoulShard({ clientId, user, item }: { clientId: string; user: User; item: Item }): Promise<void> {
        const characterName = item.character_shard
        if (!characterName) {
            hub.sendClientError(clientId, `Soul Shard item ${item.id} does not have an associated character shard.`)
            return
        }

        const character = await CharacterDao.getUserCharacterByGameId({ user_id: user.id, game_id: characterName })

        const partyPosition = user.characters.length

        if (!character) {
            const newCharacter = await CharacterGenerator.generateCharacter({
                userId: user.id,
                name: characterName,
                override: {
                    party_position: partyPosition < User.PARTY_SIZE ? partyPosition : undefined,
                },
            })

            user.characters.push(newCharacter!)
            hub.sendToUser(user.id, {
                event: GameEvent.CHARACTER_UPDATED,
                payload: {
                    character: newCharacter,
                },
            })
        } else {
            character.gainExperience(1) // Default for soul shards. In future, we can have different shard types that grant different exp amounts.
        }

        await this.consumeItem({ user, itemId: item.id })
    }

    // Deletes item if the stack size is 1, otherwise decrements stack size by 1. If item doesn't exist or user doesn't have it, sends client error.
    static async consumeItem({ user, itemId }: { user: User; itemId: string }): Promise<void> {
        const items = user.items
        const item = items.find((i) => i.id === itemId)
        if (!item) {
            throw new Error(`User ${user.id} does not have item with ID ${itemId}`)
        }

        if (item.count > 1) {
            item.count -= 1
            await ItemDao.updateItem(item)
        } else {
            await ItemDao.deleteItem(itemId)
            items.splice(items.indexOf(item), 1)
        }

        hub.sendToUser(user.id, {
            event: GameEvent.ITEMS_UPDATED,
            payload: {
                items,
            },
        })
    }
}
