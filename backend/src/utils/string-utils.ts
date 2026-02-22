export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

type SafeStringifyOptions = {
    referenceValue?: unknown // default: "reference"
    maxRecurrences?: number // default: 0 (only the first expansion)
    /**
     * Return a stable key for "same entity".
     * If it returns undefined, we fall back to object-identity tracking.
     */
    keyOf?: (obj: any) => string | undefined
}

export function safeStringify(
    value: unknown,
    space?: number,
    {
        referenceValue = "reference",
        maxRecurrences = 0,
        keyOf = (obj) => (obj && typeof obj === "object" && typeof obj.id === "string" ? obj.id : undefined),
    }: SafeStringifyOptions = {}
) {
    const allowedExpansions = 1 + Math.max(0, maxRecurrences)

    // counts by stable key (e.g. DB id)
    const keyedCounts = new Map<string, number>()

    // fallback counts by identity, for objects without keys
    const identityCounts = new WeakMap<object, number>()

    return JSON.stringify(
        value,
        function (_key, val) {
            if (typeof val !== "object" || val === null) return val

            const obj = val as any

            const k = keyOf(obj)
            if (k !== undefined) {
                const c = keyedCounts.get(k) ?? 0
                if (c >= allowedExpansions) return referenceValue
                keyedCounts.set(k, c + 1)
                return val
            }

            // fallback: object identity
            const o = obj as object
            const c = identityCounts.get(o) ?? 0
            if (c >= allowedExpansions) return referenceValue
            identityCounts.set(o, c + 1)
            return val
        },
        space
    )
}
