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

    // Mettre à jour le champ isPartner pour l'utilisateur existant
    const result = await mongoDb.collection("user").updateOne(
      { email },
      { 
        $set: { 
          isPartner: true,
          updatedAt: new Date(),
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    console.log(`✅ Utilisateur ${email} mis à jour en tant que partenaire`);

    return NextResponse.json({
      success: true,
      message: "Statut partenaire mis à jour",
    });
  } catch (error) {
    console.error("Erreur mise à jour statut partenaire:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
