import { TileObject } from "./tile-object.js"

export class Chest extends TileObject {
    constructor(chest: any) {
        super(chest)
    }

    static fromModel(chest: Chest): Chest {
        return new Chest(chest)
    }
}
