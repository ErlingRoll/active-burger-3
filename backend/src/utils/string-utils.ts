export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

type SafeStringifyOptions = {
    space?: number
    referenceValue?: unknown // default: "reference"
    keyOf?: (obj: any) => string | undefined // default: obj.id (string/number)
}

/**
 * Lineage-only reference collapsing:
 * - Only replaces with referenceValue when the same entity is already in the *current ancestor chain*.
 * - Same entity appearing in a different branch (sibling/cousin) is expanded again.
 */
export function safeStringify(value: unknown, opts: SafeStringifyOptions = {}) {
    const {
        space,
        referenceValue = "reference",
        keyOf = (obj: any) => {
            if (!obj || typeof obj !== "object") return undefined
            const id = obj.id
            return typeof id === "string" || typeof id === "number" ? String(id) : undefined
        },
    } = opts

    // Track the current recursion path (ancestors only)
    const keyStack = new Set<string>() // for entities with stable keys (id)
    const objStack = new WeakSet<object>() // fallback: identity for objects without keys

    const normalizeCollections = (val: any) => {
        if (val instanceof Set) return Array.from(val)
        if (val instanceof Map) return Object.fromEntries(val)
        return val
    }

    const walk = (raw: any): any => {
        const val = normalizeCollections(raw)

        if (val === null || typeof val !== "object") return val

        // Arrays
        if (Array.isArray(val)) {
            // arrays can participate in cycles by identity (rare but possible)
            if (objStack.has(val)) return referenceValue
            objStack.add(val)
            const out = val.map(walk)
            objStack.delete(val)
            return out
        }

        const obj = val as Record<string, any>
        const k = keyOf(obj)

        // Lineage-only cycle check
        if (k) {
            if (keyStack.has(k)) return referenceValue
            keyStack.add(k)
        } else {
            if (objStack.has(obj)) return referenceValue
            objStack.add(obj)
        }

        const out: Record<string, any> = {}
        for (const [prop, v] of Object.entries(obj)) out[prop] = walk(v)

        // Pop from current lineage
        if (k) keyStack.delete(k)
        else objStack.delete(obj)

        return out
    }

    return JSON.stringify(walk(value), null, space)
}
