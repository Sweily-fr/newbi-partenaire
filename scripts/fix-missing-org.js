/**
 * Script pour créer l'organisation manquante pour un partenaire existant
 * Usage: node scripts/fix-missing-org.js <email>
 */

import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/newbi-production";

async function fixMissingOrg(email) {
  if (!email) {
    console.error("❌ Usage: node scripts/fix-missing-org.js <email>");
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connecté à MongoDB");

    const db = client.db();

    // Récupérer l'utilisateur
    const user = await db.collection("user").findOne({ email });

    if (!user) {
      console.error(`❌ Utilisateur non trouvé: ${email}`);
      process.exit(1);
    }

    console.log(`✅ Utilisateur trouvé: ${user.name} (${user._id})`);

    // Vérifier si un member existe déjà
    const existingMember = await db.collection("member").findOne({
      userId: user._id,
    });

    if (existingMember) {
      console.log(`⚠️ Member déjà existant pour cet utilisateur`);
      console.log(`   Organization ID: ${existingMember.organizationId}`);
      console.log(`   Role: ${existingMember.role}`);
      
      // Vérifier si l'organisation existe
      const org = await db.collection("organization").findOne({
        _id: existingMember.organizationId,
      });
      
      if (org) {
        console.log(`✅ Organisation existante: ${org.name}`);
      } else {
        console.log(`❌ Organisation introuvable !`);
      }
      
      process.exit(0);
    }

    // Créer l'organisation
    const now = new Date();
    const organizationName = user.name || `Partner ${email.split("@")[0]}'s`;
    const organizationSlug = `partner-org-${user._id.toString().slice(-8)}`;

    console.log(`🔄 Création de l'organisation: ${organizationName}...`);

    const orgResult = await db.collection("organization").insertOne({
      name: organizationName,
      slug: organizationSlug,
      logo: null,
      metadata: {
        autoCreated: true,
        createdAt: now.toISOString(),
        isPartnerOrg: true,
        fixedManually: true,
      },
      createdAt: now,
    });

    const organizationId = orgResult.insertedId;
    console.log(`✅ Organisation créée: ${organizationId}`);

    // Créer le membre owner
    await db.collection("member").insertOne({
      organizationId: organizationId,
      userId: user._id,
      email: user.email,
      role: "owner",
      createdAt: now,
    });

    console.log(`✅ Membre owner créé pour ${email}`);
    console.log(`\n🎉 Correction terminée avec succès !`);
    console.log(`   L'utilisateur peut maintenant se reconnecter.`);

  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

const email = process.argv[2];
fixMissingOrg(email);
