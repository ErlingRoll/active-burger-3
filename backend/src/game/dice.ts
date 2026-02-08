export class Dice {
    static pickWeighted<T>({ table, defaultValue }: { table: Record<string, number>; defaultValue: T }): T {
        // 1) Get total weight
        const total = Object.values(table).reduce((acc, cur) => acc + Math.max(cur, 0), 0)

        // 2) Pick random number between 0 and total
        const roll = Math.random() * total

        // 3) Walk through items until we cross the roll
        let cumulative = 0
        for (const [item, weight] of Object.entries(table)) {
            cumulative += Math.max(weight, 0)
            if (roll < cumulative) {
                return item as T
            }
        }

        console.warn(
            `Dice.pickWeighted: roll of ${roll} exceeded total weight of ${total}, returning default value. Table: ${JSON.stringify(table)}`
        )
        return defaultValue
    }

    static roll(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}
