import { NextResponse } from "next/server";
import axiosInstance from "@/lib/axios";

export async function GET(request: Request) {
    try {
        // Récupérer tous les documents triés par date de création décroissante
        const response = await axiosInstance.get(
            `/api/documents/?sort=-created_at`,
            {
                headers: Object.fromEntries(request.headers)
            }
        );

        console.log("Route API - Réponse du backend:", response.data);

        // S'assurer que la réponse est dans le bon format
        const formattedResponse = {
            items: Array.isArray(response.data) ? response.data : (response.data.items || []),
            total: Array.isArray(response.data) ? response.data.length : (response.data.total || 0)
        };

        console.log("Route API - Réponse formatée:", formattedResponse);

        return NextResponse.json(formattedResponse);
    } catch (error: any) {
        console.error("Erreur lors de la récupération des documents:", error.response?.data || error.message);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des documents" },
            { status: error.response?.status || 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        
        const response = await axiosInstance.post(
            `/api/documents/`,
            formData,
            {
                headers: {
                    ...Object.fromEntries(request.headers),
                    "Content-Type": "multipart/form-data",
                }
            }
        );

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Erreur lors de l'upload du document:", error.response?.data || error.message);
        return NextResponse.json(
            { error: "Erreur lors de l'upload du document" },
            { status: error.response?.status || 500 }
        );
    }
} 