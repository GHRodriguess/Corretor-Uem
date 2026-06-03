interface DadosToken {
    is_staff?: boolean;
    [key: string]: unknown;
}

export function decodificarToken(token: string): DadosToken | null {
    try {
        const payloadBase64 = token.split(".")[1];
        if (!payloadBase64) {
            return null;
        }
        const decodedString = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decodedString);
    } catch {
        return null;
    }
}

export function verificarSeStaff(token: string | null): boolean {
    if (!token) {
        return false;
    }
    const decoded = decodificarToken(token);
    return !!decoded?.is_staff;
}
