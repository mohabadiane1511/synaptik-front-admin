import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function DELETE(
    request: Request,
    { params }: { params: { documentId: string } }
) {
    try {
        await axios.delete(
            `${API_URL}/api/documents/${params.documentId}`,
            {
                headers: Object.fromEntries(request.headers)
            }
        );

        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error("Erreur lors de la suppression du document:", error.response?.data || error.message);
        return NextResponse.json(
            { error: "Erreur lors de la suppression du document" },
            { status: error.response?.status || 500 }
        );
    }
} 