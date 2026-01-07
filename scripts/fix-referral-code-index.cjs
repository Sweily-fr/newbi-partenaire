/**
 * Script pour supprimer l'index unique sur referralCode
 * Plusieurs utilisateurs peuvent avoir le même referralCode (filleuls d'un même parrain)
 */

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI non défini dans .env.local');
  process.exit(1);
}

async function fixReferralCodeIndex() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db();
    const userCollection = db.collection('user');

    // Lister les index existants
    console.log('\n📋 Index existants sur la collection user :');
    const indexes = await userCollection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}:`, index.key);
    });

    // Vérifier si l'index referralCode_1 existe
    const referralCodeIndex = indexes.find(idx => idx.name === 'referralCode_1');
    
    if (referralCodeIndex) {
      console.log('\n⚠️  Index unique trouvé sur referralCode');
      console.log('🔄 Suppression de l\'index referralCode_1...');
      
      await userCollection.dropIndex('referralCode_1');
      console.log('✅ Index referralCode_1 supprimé avec succès');
      
      // Mettre à jour les utilisateurs avec referralCode vide
      console.log('\n🔄 Mise à jour des utilisateurs avec referralCode vide...');
      const result = await userCollection.updateMany(
        { referralCode: "" },
        { $unset: { referralCode: "" } }
      );
      console.log(`✅ ${result.modifiedCount} utilisateur(s) mis à jour`);
      
    } else {
      console.log('\n✅ Aucun index unique sur referralCode trouvé');
    }

    console.log('\n✅ Opération terminée avec succès');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
fixReferralCodeIndex();
