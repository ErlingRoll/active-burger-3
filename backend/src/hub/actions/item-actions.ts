import { CharacterDao } from "../../database/character-dao.js"
import { ItemDao } from "../../database/item-dao.js"
import { CharacterGenerator } from "../../generators/character/character-generator.js"
import { hub } from "../../index.js"
import { CharacterName, ItemType } from "../../models/constants.js"
import { Item } from "../../models/item/item.js"

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
        user: any
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

    static async useSoulShard({ clientId, user, item }: { clientId: string; user: any; item: Item }): Promise<void> {
        const characterName = item.character_shard
        if (!characterName) {
            hub.sendClientError(clientId, `Soul Shard item ${item.id} does not have an associated character shard.`)
            return
        }

        const character = await CharacterDao.getUserCharacterByGameId({ user_id: user.id, game_id: characterName })

        if (!character) {
            await CharacterGenerator.generateCharacter({
                userId: user.id,
                name: characterName,
            })
        } else {
            character.gainExperience(1) // Default for soul shards. In future, we can have different shard types that grant different exp amounts.
        }
    }
}
