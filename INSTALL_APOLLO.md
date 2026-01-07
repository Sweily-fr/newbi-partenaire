# Installation Apollo Client

## 📦 Installation

```bash
npm install @apollo/client graphql
```

## ⚙️ Configuration

Les fichiers suivants ont déjà été créés et sont prêts à l'emploi :

1. ✅ `/src/graphql/partner.js` - Queries et mutations GraphQL
2. ✅ `/app/dashboard/page.jsx` - Dashboard avec useQuery
3. ✅ `/components/withdrawal-card.jsx` - Composant avec useMutation

## 🔧 Prochaines étapes

### 1. Installer les dépendances
```bash
cd /Users/joaquimgameiro/Downloads/Newbi_project/Newbi_FB_V2/newbi-afilliate
npm install @apollo/client graphql
```

### 2. Créer le provider Apollo (à faire)
Créer `/src/lib/apollo-client.js` :

```javascript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Récupérer le token de session better-auth
  return {
    headers: {
      ...headers,
      // Les cookies sont automatiquement envoyés avec credentials: 'include'
    },
    credentials: 'include',
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### 3. Wrapper l'app avec ApolloProvider
Modifier `/app/layout.jsx` :

```javascript
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/src/lib/apollo-client';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ApolloProvider client={apolloClient}>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
```

### 4. Variables d'environnement
Créer/modifier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

## ✅ Vérification

Après installation, le dashboard devrait fonctionner avec :
- ✅ Chargement des statistiques partenaires
- ✅ Affichage des graphiques
- ✅ Système de retrait fonctionnel

## 🔍 Dépannage

### Erreur CORS
Si vous avez une erreur CORS, vérifier dans `newbi-api` :

```javascript
// server.js
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));
```

### Erreur d'authentification
Vérifier que les cookies sont bien envoyés :

```javascript
// apollo-client.js
credentials: 'include', // Important !
```
