/**
 * Mensaje de un error de la API (el `message` de las excepciones de NestJS), o `fallback` si no trae uno.
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === "object" && "message" in error) {
        const { message } = error as { message: unknown };
        if (Array.isArray(message)) return message.join(" ");
        if (typeof message === "string") return message;
    }
    return fallback;
}

/**
 * Código HTTP de un error de la API, si lo trae.
 */
export function apiErrorStatus(error: unknown): number | undefined {
    if (error && typeof error === "object" && "statusCode" in error) {
        const { statusCode } = error as { statusCode: unknown };
        return typeof statusCode === "number" ? statusCode : undefined;
    }
    return undefined;
}
