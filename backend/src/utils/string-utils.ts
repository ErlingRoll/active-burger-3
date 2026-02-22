export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

type SafeStringifyOptions = {
    space?: number
    referenceValue?: unknown // default: "reference"
    maxRecurrences?: number // 0 => expand once per root property
    keyOf?: (obj: any) => string | undefined // default: obj.id (string/number)
}

/**
 * "Root property" = the first key beneath the top-level root object passed to safeStringify().
 * Example: for { floors: {...}, party: {...} }
 * - everything under floors has rootKey = "floors"
 * - everything under party has rootKey = "party"
 *
 * If the root value itself is an array, each element gets its own rootKey like "[0]", "[1]", ...
 */
export function safeStringify(value: unknown, opts: SafeStringifyOptions = {}) {
    const {
        space,
        referenceValue = "reference",
        maxRecurrences = 0,
        keyOf = (obj: any) => {
            if (!obj || typeof obj !== "object") return undefined
            const id = obj.id
            return typeof id === "string" || typeof id === "number" ? String(id) : undefined
        },
    } = opts

    const allowedExpansions = 1 + Math.max(0, maxRecurrences)

    // counts scoped by rootKey: rootKey -> (entityKey -> count)
    const keyedCountsByRoot = new Map<string, Map<string, number>>()

    // fallback for objects without keys: rootKey -> (objectIdentity -> count)
    const identityCountsByRoot = new Map<string, WeakMap<object, number>>()

    // used only to propagate the current rootKey down the tree
    const rootKeyOfObject = new WeakMap<object, string>()

    const rootObj = typeof value === "object" && value !== null ? (value as object) : null
    const rootIsArray = Array.isArray(value)

    const getKeyedCounts = (rootKey: string) => {
        let m = keyedCountsByRoot.get(rootKey)
        if (!m) keyedCountsByRoot.set(rootKey, (m = new Map()))
        return m
    }

    const getIdentityCounts = (rootKey: string) => {
        let wm = identityCountsByRoot.get(rootKey)
        if (!wm) identityCountsByRoot.set(rootKey, (wm = new WeakMap()))
        return wm
    }

    // If you ever pass Sets/Maps, JSON.stringify won’t serialize them meaningfully.
    // This makes them JSON-friendly before the cycle/repeat logic runs.
    const normalizeCollections = (val: any) => {
        if (val instanceof Set) return Array.from(val)
        if (val instanceof Map) return Object.fromEntries(val)
        return val
    }

    return JSON.stringify(
        value,
        function (key, rawVal) {
            const val = normalizeCollections(rawVal)

            if (typeof val !== "object" || val === null) return val
            const obj = val as object

            // Determine the "root property scope" for this value.
            // - root call: key === "" (wrapper) => scope "$"
            // - direct children of the provided root object => scope is that property name (or "[idx]" if root is array)
            // - deeper descendants => inherit from parent via rootKeyOfObject
            let rootKey = "$"

            if (key === "") {
                rootKey = "$"
            } else if (rootObj && this === rootObj) {
                rootKey = rootIsArray ? `[${key}]` : String(key)
            } else if (typeof this === "object" && this !== null) {
                rootKey = rootKeyOfObject.get(this as object) ?? "$"
            }

            // Apply recurrence limits within this rootKey scope
            const entityKey = keyOf(val)

            if (entityKey) {
                const counts = getKeyedCounts(rootKey)
                const count = counts.get(entityKey) ?? 0

                if (count >= allowedExpansions) return referenceValue

                counts.set(entityKey, count + 1)
                rootKeyOfObject.set(obj, rootKey)
                return val
            }

            // fallback for objects with no entity key: use identity within rootKey scope
            const identityCounts = getIdentityCounts(rootKey)
            const count = identityCounts.get(obj) ?? 0

            if (count >= allowedExpansions) return referenceValue

            identityCounts.set(obj, count + 1)
            rootKeyOfObject.set(obj, rootKey)
            return val
        },
        space
    )
}
