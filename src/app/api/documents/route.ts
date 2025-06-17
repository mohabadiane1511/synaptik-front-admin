import { NextResponse } from "next/server";
import axiosInstance from "@/lib/axios";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const skip = searchParams.get("skip") || "0";
        const limit = searchParams.get("limit") || "10";

        const response = await axiosInstance.get(
            `/api/documents/?skip=${skip}&limit=${limit}`,
            {
                headers: Object.fromEntries(request.headers)
            }
        );

        return NextResponse.json(response.data);
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