import { Realm } from "../game/world"
import { Item } from "./item"

export interface RenderObject {
    id: string
    object_id: string
    type: string
    created_at?: string
    name: string
    name_visible: boolean
    x: number
    y: number
    z: number
    direction: string
    texture?: string
    ext?: string
    width: number
    height: number
    solid: boolean
    gold: number
    realm: Realm
    props: { [key: string]: any }
}

export interface Entity extends RenderObject {
    level: number
    max_hp: number
    current_hp: number
    regen: number
}

// export interface Character extends Entity {
//     account_id: string
//     items: { [id: string]: Item }
//     equipment: { [slot: string]: Item | null }
//     max_exp: number
//     current_exp: number
// }
