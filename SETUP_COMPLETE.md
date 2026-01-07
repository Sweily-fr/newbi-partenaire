# 🚀 Setup Complet - Espace Partenaire Newbi

## ✅ Fichiers déjà créés

### Configuration Apollo Client
- ✅ `/src/lib/apollo-client.js` - Client Apollo configuré
- ✅ `/src/components/apollo-provider.jsx` - Provider wrapper
- ✅ `/app/layout.tsx` - Layout mis à jour avec ApolloProvider

### GraphQL
- ✅ `/src/graphql/partner.js` - Queries et mutations

### Composants
- ✅ `/app/dashboard/page.jsx` - Dashboard connecté à l'API
- ✅ `/components/commission-tiers.jsx` - Paliers dynamiques
- ✅ `/components/withdrawal-card.jsx` - Retraits fonctionnels
- ✅ `/components/partner-profile-modal.jsx` - Profil avec mise à jour

## 📦 Installation

### 1. Installer Apollo Client

```bash
cd /Users/joaquimgameiro/Downloads/Newbi_project/Newbi_FB_V2/newbi-afilliate
npm install @apollo/client graphql
```

### 2. Créer le fichier .env.local

```bash
cat > .env.local << EOF
# API GraphQL
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3001

# MongoDB
MONGODB_URI=mongodb://localhost:27017/newbi-partner
EOF
```

### 3. Démarrer le serveur

```bash
npm run dev
```

## 🔧 Configuration Backend

### Vérifier CORS dans newbi-api

Dans `/newbi-api/src/server.js` :

```javascript
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://partner.newbi.fr'
  ],
  credentials: true,
}));
```

### Vérifier que le serveur GraphQL tourne

```bash
cd /Users/joaquimgameiro/Downloads/Newbi_project/Newbi_FB_V2/newbi-api
npm run dev
```

Le serveur devrait être accessible sur `http://localhost:4000/graphql`

## ✅ Vérification

### 1. Tester Apollo Client

Ouvrir le navigateur sur `http://localhost:3001/dashboard`

Vous devriez voir :
- ✅ Stats cards avec données réelles (ou 0 si pas de données)
- ✅ Graphiques (vides si pas de données)
- ✅ Paliers de commission
- ✅ Carte de retrait

### 2. Vérifier la console

Aucune erreur ne devrait apparaître concernant :
- ❌ `Module not found: @apollo/client`
- ❌ `Cannot find module 'Subscription'`
- ❌ Erreurs CORS

### 3. Tester une mutation

Essayer de demander un retrait :
1. Entrer un montant (ex: 100)
2. Cliquer sur "Demander le retrait"
3. Vérifier le message de validation

## 📊 Données de test

Pour tester avec des données, vous pouvez créer manuellement des commissions dans MongoDB :

```javascript
// Dans MongoDB Compass ou mongosh
use newbi-partner

db.partnercommissions.insertOne({
  partnerId: ObjectId("votre-user-id"),
  referralId: ObjectId("filleul-id"),
  subscriptionId: ObjectId("subscription-id"),
  paymentAmount: 155.42,
  commissionRate: 20,
  commissionAmount: 31.08,
  subscriptionType: "annual",
  status: "confirmed",
  generatedAt: new Date(),
  confirmedAt: new Date()
})
```

## 🐛 Dépannage

### Erreur: Module not found @apollo/client
```bash
npm install @apollo/client graphql
```

### Erreur: Cannot connect to GraphQL
Vérifier que :
1. Le serveur API tourne sur port 4000
2. L'URL dans `.env.local` est correcte
3. CORS est configuré

### Erreur: Unauthorized
Vérifier que :
1. Vous êtes connecté avec un compte partenaire
2. Les cookies de session sont envoyés (`credentials: 'include'`)
3. Le champ `isPartner` est à `true` dans la base de données

### Pas de données affichées
C'est normal si :
- Aucune commission n'a été créée
- Aucun filleul n'est inscrit
- Les stats devraient afficher 0

## 🎯 Prochaines étapes

1. **Créer des webhooks Stripe** pour auto-confirmer les commissions
2. **Implémenter la création de commissions** lors du premier paiement
3. **Créer un dashboard admin** pour gérer les retraits
4. **Ajouter une page filleuls** avec liste détaillée
5. **Implémenter les notifications** temps réel

## 📚 Documentation

- ✅ `INSTALL_APOLLO.md` - Guide d'installation Apollo
- ✅ `ENV_EXAMPLE.md` - Variables d'environnement
- ✅ `/docs/PARTNER_STATS_API.md` - Documentation API backend
- ✅ `/docs/PARTNER_FRONTEND_INTEGRATION.md` - Guide frontend
- ✅ `/docs/PARTNER_INTEGRATION_SUMMARY.md` - Résumé complet

## ✨ Résultat attendu

Après installation, vous devriez avoir :
- ✅ Dashboard partenaire fonctionnel
- ✅ Connexion à l'API GraphQL
- ✅ Affichage des statistiques en temps réel
- ✅ Système de retrait opérationnel
- ✅ Mise à jour du profil fonctionnelle

**Le système est prêt à l'emploi !** 🎉
