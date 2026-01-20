

class AuthService {
    private static instance: AuthService;
    private tokenKey = "admin_auth_token";

    private constructor() { }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    /**
     * Authenticate with the backend
     */
    public async login(password: string): Promise<{ success: boolean; message?: string; token?: string }> {
        const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || (process.env.VITE_GOOGLE_SCRIPT_URL as string);
        if (!SCRIPT_URL) return { success: false, message: "Script URL not configured" };

        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain" }, // GAS requires plain text often but JSON stringified body
                body: JSON.stringify({ action: "LOGIN", data: { password } })
            });

            const result = await response.json();

            if (result.success && result.token) {
                this.setSession(result.token);
            }

            return result;
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: "Network Error" };
        }
    }

    /**
     * Store session token
     */
    public setSession(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * Retrieve session token
     */
    public getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Check if user is authenticated
     */
    public isAuthenticated(): boolean {
        const token = this.getToken();
        // Basic check: Token exists and is long enough to be a UUID
        return !!token && token.length > 10 && token !== "secure-session-active";
    }

    /**
     * Logout user
     */
    public logout(): void {
        localStorage.removeItem(this.tokenKey);
        window.location.href = "/admin/login";
    }
}

export const authService = AuthService.getInstance();
