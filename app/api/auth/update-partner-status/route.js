import { NextResponse } from "next/server";
import { mongoDb } from "@/src/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email requis" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur existant
    const user = await mongoDb.collection("user").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour le champ isPartner pour l'utilisateur existant
    await mongoDb.collection("user").updateOne(
      { email },
      { 
        $set: { 
          isPartner: true,
          updatedAt: new Date(),
        } 
      }
    );

    console.log(`✅ Utilisateur ${email} mis à jour en tant que partenaire`);

    // Vérifier si l'utilisateur a déjà une organisation (en tant que owner)
    const existingMember = await mongoDb.collection("member").findOne({
      userId: user._id,
      role: "owner",
    });

    if (!existingMember) {
      console.log(`🔄 Création organisation pour l'utilisateur converti ${email}...`);

      const now = new Date();
      const organizationName = user.name || `Partner ${email.split("@")[0]}'s`;
      const organizationSlug = `partner-org-${user._id.toString().slice(-8)}`;

      // Créer l'organisation
      const orgResult = await mongoDb.collection("organization").insertOne({
        name: organizationName,
        slug: organizationSlug,
        logo: null,
        metadata: {
          autoCreated: true,
          createdAt: now.toISOString(),
          isPartnerOrg: true,
          convertedFromNewbi: true,
        },
        createdAt: now,
      });

      const organizationId = orgResult.insertedId;
      console.log(`✅ Organisation créée: ${organizationId}`);

      // Créer le membre owner
      await mongoDb.collection("member").insertOne({
        organizationId: organizationId,
        userId: user._id,
        email: user.email,
        role: "owner",
        createdAt: now,
      });

      console.log(`✅ Membre owner créé pour ${email}`);
    } else {
      console.log(`✅ Organisation déjà existante pour ${email}, skip création`);
    }

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
