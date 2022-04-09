export function assert(condition: boolean, message: string) {
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    if (!condition) {
        throw new Error(message);
    }
}
