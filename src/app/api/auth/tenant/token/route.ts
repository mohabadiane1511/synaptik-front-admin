import { NextResponse } from "next/server";
import axios from "axios";
import { LoginRequest } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();

    const response = await axios.post(
      `${API_URL}/api/auth/tenant/token`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Erreur d'authentification:", error.response?.data || error.message);
    
    // On gère les différents cas d'erreur
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data.detail || "Erreur d'authentification" },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
} 