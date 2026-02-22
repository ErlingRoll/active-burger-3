import { MonsterSchema } from "../../database/types/schemas.js"
import { Rarity } from "../../models/constants.js"

export enum MonsterName {
    KARATE_PANDA = "karate_panda",
    VAMPIRE = "vampire",
    GARGOYLE = "gargoyle",
    GUARDIAN = "guardian",
    DEMON = "demon",
    ARCHMAGE = "archmage",
}

export const archmage: Partial<MonsterSchema> = {
    rarity: Rarity.EPIC,
    texture: "archmage",
    name: "Archmage",
    game_id: MonsterName.ARCHMAGE,
    max_hp: 100,
    damage: 30,
}

export const demon: Partial<MonsterSchema> = {
    rarity: Rarity.RARE,
    texture: "demon",
    name: "Demon",
    game_id: MonsterName.DEMON,
    max_hp: 70,
    damage: 15,
}

export const guardian: Partial<MonsterSchema> = {
    rarity: Rarity.RARE,
    texture: "guardian",
    name: "Guardian",
    game_id: MonsterName.GUARDIAN,
    max_hp: 40,
    damage: 12,
}

export const gargoyle: Partial<MonsterSchema> = {
    rarity: Rarity.COMMON,
    texture: "gargoyle",
    name: "Gargoyle",
    game_id: MonsterName.GARGOYLE,
    max_hp: 25,
    damage: 8,
}

export const vampire: Partial<MonsterSchema> = {
    rarity: Rarity.COMMON,
    texture: "vampire",
    name: "Vampire",
    game_id: MonsterName.VAMPIRE,
    max_hp: 15,
    damage: 5,
}

export const karatePanda: Partial<MonsterSchema> = {
    rarity: Rarity.COMMON,
    texture: "karate_panda",
    name: "Karate Panda",
    game_id: MonsterName.KARATE_PANDA,
    max_hp: 7,
    damage: 2,
}

export const monsters: { [key: string]: Partial<MonsterSchema> } = {
    [MonsterName.ARCHMAGE]: archmage,
    [MonsterName.DEMON]: demon,
    [MonsterName.GUARDIAN]: guardian,
    [MonsterName.GARGOYLE]: gargoyle,
    [MonsterName.VAMPIRE]: vampire,
    [MonsterName.KARATE_PANDA]: karatePanda,
}

export const defaultMonsterRarityTable = {
    [MonsterName.KARATE_PANDA]: 100,
    [MonsterName.VAMPIRE]: 5,
    [MonsterName.GARGOYLE]: 2000,
    [MonsterName.GUARDIAN]: 0,
    [MonsterName.DEMON]: 0,
    [MonsterName.ARCHMAGE]: 0,
}
