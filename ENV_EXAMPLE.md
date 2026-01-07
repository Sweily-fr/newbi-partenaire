# Variables d'environnement

Créer un fichier `.env.local` à la racine du projet avec :

```env
# API GraphQL
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3001

# MongoDB
MONGODB_URI=mongodb://localhost:27017/newbi-partner
```

## Production

Pour la production, utiliser :

```env
NEXT_PUBLIC_API_URL=https://api.newbi.fr/graphql
BETTER_AUTH_URL=https://partner.newbi.fr
```
