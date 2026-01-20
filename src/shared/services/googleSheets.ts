import { ServiceResponse } from "../types/models";



interface Payload {
    action: string;
    auth?: string;
    data?: any;
    id?: string;
    // Removed endpoint/sheetName to align with Legacy Backend strictly
}


export class GoogleSheetsService {
    private static getToken(): string | null {
        return localStorage.getItem("admin_auth_token");
    }

    // Helper for easier mocking in tests
    private static getScriptUrl(): string | undefined {
        return import.meta.env.VITE_GOOGLE_SCRIPT_URL || (process.env.VITE_GOOGLE_SCRIPT_URL as string);
    }

    static async request<T>(payload: Payload): Promise<ServiceResponse<T>> {
        const SCRIPT_URL = this.getScriptUrl();

        if (!SCRIPT_URL) {
            console.error("VITE_GOOGLE_SCRIPT_URL is missing.");
            return { success: false, message: "Configuration Error" };
        }

        const token = this.getToken();
        if (token) payload.auth = token;

        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(payload),
            });

            const json = await response.json();
            return json as ServiceResponse<T>;

        } catch (error) {
            console.error("API Request Failed", error);
            return { success: false, message: "Network Error" };
        }
    }

    // --- LEGACY BACKEND ADAPTER ---

    static async getAllData(): Promise<ServiceResponse<any>> {
        // Legacy backend action "getData" returns everything
        // Backend expects 'auth' inside 'data' property for this specific action logic
        const token = this.getToken();
        return this.request<any>({
            action: "getData",
            data: { auth: token }
        });
    }

    static async createItem<T>(endpoint: string, data: any): Promise<ServiceResponse<T>> {
        // Map Endpoint -> Legacy Action
        const action = this.mapAction(endpoint, "add");
        return this.request<T>({ action, data });
    }

    static async updateItem<T>(endpoint: string, id: string, data: any): Promise<ServiceResponse<T>> {
        const action = this.mapAction(endpoint, "update");
        // Special case: updateSettings/updateHero might not typically take ID in legacy, 
        // but our unified method passes it. The legacy backend crud/updateSingleRowSheet 
        // handles it if we are careful.

        // Fix: updateSettings/updateHero don't use IDs in the legacy payload for single row
        if (endpoint === "Settings" || endpoint === "Hero") {
            return this.request<T>({ action, data });
        }

        return this.request<T>({ action, id, data });
    }

    static async deleteItem<T>(endpoint: string, id: string): Promise<ServiceResponse<T>> {
        const action = this.mapAction(endpoint, "delete");
        return this.request<T>({ action, id });
    }

    private static mapAction(endpoint: string, verb: "add" | "update" | "delete"): string {
        // Singularize helpers
        const singular = endpoint.endsWith('s') ? endpoint.slice(0, -1) : endpoint;

        // Special Cases
        if (endpoint === "Messages" && verb === "update") return "updateMessageStatus";

        // Standard (dromedaryCase): addProject, updateSkill
        return `${verb}${singular}`;
    }

    // Auth
    static async login(password: string) {
        return this.request<{ token: string, expiresIn: number }>({
            action: "LOGIN",
            data: { password }
        });
    }
}
