// Script de test des variables d'environnement
console.log('=== Test des variables d\'environnement ===\n');

console.log('MONGODB_URI:', process.env.MONGODB_URI || '❌ NON DÉFINIE');
console.log('BETTER_AUTH_URL:', process.env.BETTER_AUTH_URL || '❌ NON DÉFINIE');
console.log('BETTER_AUTH_SECRET:', process.env.BETTER_AUTH_SECRET ? '✅ DÉFINIE' : '❌ NON DÉFINIE');
console.log('NEXT_PUBLIC_BETTER_AUTH_URL:', process.env.NEXT_PUBLIC_BETTER_AUTH_URL || '❌ NON DÉFINIE');
console.log('PORT:', process.env.PORT || '❌ NON DÉFINIE');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ NON DÉFINIE');

console.log('\n=== Test de connexion MongoDB ===\n');

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice-app';

try {
  const client = new MongoClient(uri);
  await client.connect();
  console.log('✅ Connexion MongoDB réussie');
  
  const db = client.db();
  const collections = await db.listCollections().toArray();
  console.log(`📊 Collections trouvées: ${collections.length}`);
  console.log('Collections:', collections.map(c => c.name).join(', '));
  
  // Vérifier la collection user
  const userCount = await db.collection('user').countDocuments();
  console.log(`👥 Utilisateurs dans la base: ${userCount}`);
  
  await client.close();
  console.log('\n✅ Test terminé avec succès');
} catch (error) {
  console.error('❌ Erreur de connexion MongoDB:', error.message);
  process.exit(1);
}
