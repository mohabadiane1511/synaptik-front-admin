import axios from "axios";
import { DocumentResponse, DocumentStatusResponse, DocumentListResponse } from "@/types/documents";

export const documentsService = {
    async uploadDocument(file: File): Promise<DocumentResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post<DocumentResponse>(
            "/api/documents",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    },

    async getDocumentStatus(documentId: number): Promise<DocumentStatusResponse> {
        const response = await axios.get<DocumentStatusResponse>(
            `/api/documents/${documentId}/status`
        );
        return response.data;
    },

    async listDocuments(): Promise<DocumentListResponse> {
        try {
            const response = await axios.get<DocumentListResponse>('/api/documents');
            
            console.log("Réponse brute de l'API:", response.data);
            
            // S'assurer que la réponse a le bon format
            const formattedResponse: DocumentListResponse = {
                items: Array.isArray(response.data) ? response.data : response.data.items || [],
                total: typeof response.data.total === 'number' ? response.data.total : (Array.isArray(response.data) ? response.data.length : 0),
                skip: 0,  // Ces valeurs ne sont plus utilisées mais nécessaires pour le type
                limit: 0  // Ces valeurs ne sont plus utilisées mais nécessaires pour le type
            };
            
            console.log("Réponse formatée:", formattedResponse);
            
            return formattedResponse;
        } catch (error) {
            console.error("Erreur lors de la récupération des documents:", error);
            throw error;
        }
    },

    async deleteDocument(documentId: number): Promise<void> {
        await axios.delete(`/api/documents/${documentId}`);
    }
}; 