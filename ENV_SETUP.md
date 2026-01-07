# Configuration des variables d'environnement

## Fichier `.env.local` à créer

Créez un fichier `.env.local` à la racine du projet `newbi-afilliate` avec le contenu suivant :

```env
# ============================================
# MongoDB Configuration
# ============================================
# URI de connexion MongoDB (partagée avec NewbiV2)
MONGODB_URI=mongodb://localhost:27017/newbi

# ============================================
# Better Auth Configuration
# ============================================
# URL de base pour Better Auth (côté serveur)
BETTER_AUTH_URL=http://localhost:3001

# Secret pour signer les tokens JWT
# Générer avec: openssl rand -base64 32
BETTER_AUTH_SECRET=your-secret-key-here-change-me

# URL publique pour Better Auth (côté client)
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001

# ============================================
# Application Configuration
# ============================================
# Port de l'application (3001 pour éviter conflit avec NewbiV2)
PORT=3001

# Environnement
NODE_ENV=development

# ============================================
# Email Configuration (Resend)
# ============================================
# Clé API Resend pour l'envoi d'emails
# Obtenir sur: https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here
```

## 🔐 Génération du secret

Pour générer un secret sécurisé :

```bash
# Sur macOS/Linux
openssl rand -base64 32

# Ou avec Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📝 Notes importantes

1. **MONGODB_URI** : Doit pointer vers la même base de données que NewbiV2 pour partager les utilisateurs
2. **BETTER_AUTH_SECRET** : Doit être différent de celui de NewbiV2 pour la sécurité
3. **PORT** : Utiliser 3001 pour éviter les conflits avec NewbiV2 (port 3000)
4. **BETTER_AUTH_URL** : Doit correspondre au port configuré
5. **RESEND_API_KEY** : Nécessaire pour l'envoi des emails de vérification et de réinitialisation de mot de passe

## 🚀 Production

Pour la production, mettre à jour les URLs :

```env
BETTER_AUTH_URL=https://partner.newbi.fr
NEXT_PUBLIC_BETTER_AUTH_URL=https://partner.newbi.fr
MONGODB_URI=mongodb://production-host:27017/newbi
NODE_ENV=production
```

## ✅ Vérification

Pour vérifier que les variables sont correctement chargées :

```bash
npm run dev
```

L'application devrait démarrer sur `http://localhost:3001`
