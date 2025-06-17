import { NextResponse } from "next/server";
import axiosInstance from "@/lib/axios";

export async function GET(
    request: Request,
    { params }: { params: { documentId: string } }
) {
    try {
        const response = await axiosInstance.get(
            `/api/documents/${params.documentId}/status`,
            {
                headers: Object.fromEntries(request.headers)
            }
        );

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Erreur lors de la vérification du statut:", error.response?.data || error.message);
        return NextResponse.json(
            { error: "Erreur lors de la vérification du statut" },
            { status: error.response?.status || 500 }
        );
    }
} 