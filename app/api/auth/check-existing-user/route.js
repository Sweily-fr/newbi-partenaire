import { NextResponse } from "next/server";
import { mongoDb } from "@/src/lib/mongodb";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await mongoDb.collection("user").findOne({ email });

    if (!user) {
      return NextResponse.json({
        exists: false,
        isPartner: false,
      });
    }

    return NextResponse.json({
      exists: true,
      isPartner: user.isPartner || false,
    });
  } catch (error) {
    console.error("Erreur vérification utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
