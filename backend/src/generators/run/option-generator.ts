import { LootRunOption } from "../../models/run-choice/options/loot-option.js"
import { RunOption, RunOptionType } from "../../models/run-choice/run-option.js"

export class OptionGenerator {
    static runOptionFromModel(runOption: RunOption | null): RunOption | null {
        if (!runOption) return null
        switch (runOption.type) {
            case RunOptionType.LOOT:
                return new LootRunOption(runOption as LootRunOption)
            default:
                console.error("Unknown run option type:", runOption.type)
                return null
        }
    }
}
