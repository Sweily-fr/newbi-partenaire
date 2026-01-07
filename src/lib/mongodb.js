import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let mongoDb;

if (process.env.NODE_ENV === "development") {
  // En développement, utiliser une variable globale pour éviter les reconnexions
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
  }
  client = global._mongoClient;
} else {
  // En production, créer un nouveau client
  client = new MongoClient(uri, options);
}

// Connexion à la base de données
if (!global._mongoDbPromise) {
  global._mongoDbPromise = client.connect().then((client) => {
    console.log("✅ MongoDB connecté (Partner Interface)");
    return client.db();
  });
}

mongoDb = await global._mongoDbPromise;

export { mongoDb, client };
