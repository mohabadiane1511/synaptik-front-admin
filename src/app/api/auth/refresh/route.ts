import { NextResponse } from "next/server";
import axios from "axios";
import { RefreshTokenRequest } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const body: RefreshTokenRequest = await request.json();

    const response = await axios.post(
      `${API_URL}/api/auth/refresh`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Erreur de rafraîchissement du token:", error.response?.data || error.message);
    
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data.detail || "Erreur de rafraîchissement du token" },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
} 