const originalError = console.error

console.error = (...args: unknown[]) => {
    if (args[0] instanceof Error) {
        originalError(args[0].stack)
        if (args.length > 1) {
            originalError(...args.slice(1))
        }
        return
    }

    const err = new Error(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "))

    originalError(err.stack)
}
