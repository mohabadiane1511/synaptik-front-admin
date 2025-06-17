import axios from "axios";
import { getSession, deleteSession } from "./session";

// Créer une instance axios avec la configuration de base
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
});

// Ajouter le token aux requêtes
axiosInstance.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
        if (session.tenant_id) {
            config.headers["X-Tenant-ID"] = session.tenant_id.toString();
        }
    }
    return config;
});

// Gérer les erreurs d'authentification
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await deleteSession();
            if (typeof window !== "undefined") {
                window.location.href = "/auth/login";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 