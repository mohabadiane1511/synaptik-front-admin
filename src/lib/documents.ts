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

    async listDocuments(skip: number = 0, limit: number = 10): Promise<DocumentListResponse> {
        const response = await axios.get<DocumentResponse[]>(
            `/api/documents?skip=${skip}&limit=${limit}`
        );
        
        return {
            items: response.data,
            total: response.data.length, // TODO: À remplacer par le total réel quand l'API le fournira
            skip,
            limit
        };
    },

    async deleteDocument(documentId: number): Promise<void> {
        await axios.delete(`/api/documents/${documentId}`);
    }
}; 