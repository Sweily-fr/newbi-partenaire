# Architecture - newbi-afilliate

Portail partenaires pour le programme d'affiliation Newbi.

## Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| Next.js | 16 | Framework (App Router) |
| React | 19 | UI Library |
| TypeScript | 5 | Typage |
| Apollo Client | 4.0 | Client GraphQL |
| Tailwind CSS | 4 | Styling |
| shadcn/ui | New York | Composants UI |
| Better Auth | 1.3 | Authentification |
| MongoDB | 7.0 | Base de données |

**Port** : 3001

---

## Structure des Dossiers

```
newbi-afilliate/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── auth/                     # Pages auth (login, signup)
│   ├── dashboard/                # Dashboard partenaire (protégé)
│   ├── admin/                    # Section admin (protégé)
│   ├── access-denied/            # Page accès refusé
│   ├── api/                      # API Routes
│   ├── layout.tsx                # Layout racine
│   └── globals.css               # Styles globaux
├── components/                   # Composants UI
│   ├── ui/                       # Primitives shadcn/ui
│   └── admin/                    # Composants admin
├── src/
│   ├── lib/                      # Utilitaires (auth, apollo, mongodb)
│   ├── graphql/                  # Queries & mutations
│   ├── contexts/                 # React Contexts
│   ├── hooks/                    # Custom hooks
│   └── components/               # Composants additionnels
├── emails/                       # Templates React Email
├── public/                       # Assets statiques
└── scripts/                      # Scripts build/deploy
```

---

## Routing

### Routes Publiques

| Route | Description |
|-------|-------------|
| `/` | Landing page (programme partenaire) |
| `/auth/login` | Connexion partenaire |
| `/auth/signup` | Inscription partenaire |
| `/access-denied` | Accès refusé (non-partenaire) |

### Routes Protégées (Dashboard)

| Route | Description |
|-------|-------------|
| `/dashboard` | Stats partenaire (earnings, referrals) |
| `/dashboard/referrals` | Liste des filleuls |

### Routes Admin

| Route | Description |
|-------|-------------|
| `/admin/withdrawals` | Gestion des retraits |

### API Routes

| Route | Description |
|-------|-------------|
| `/api/auth/[...all]` | Handler Better Auth |
| `/api/auth/check-existing-user` | Vérification email |
| `/api/auth/update-partner-status` | Mise à jour statut partenaire |
| `/api/emails/send-withdrawal-notification` | Notifications email retrait |

---

## Authentification

### Configuration Serveur (`src/lib/auth.js`)

- **Adapter** : MongoDB (mongodbAdapter)
- **Session** : 30 jours
- **Vérification email** : Requise (1h expiration)
- **Rate limiting** : 5 tentatives / 60 secondes

### Champs Utilisateur Étendus

```typescript
{
  name: string,
  lastName: string,
  phoneNumber: string,
  company: string,
  avatar: string,
  isActive: boolean,      // default: true
  isPartner: boolean,     // default: false ← CLÉ
  referralCode: string    // unique par partenaire
}
```

### Hooks Sécurité

1. **beforeSignIn** - Vérifie `isPartner` et `isActive`
2. **User Creation** - Auto-génère organisation
3. **Session Creation** - Attache `activeOrganizationId`

### Client (`src/lib/auth-client.js`)

```javascript
import { createAuthClient } from "better-auth/react"

export const { signUp, signIn, signOut, updateUser, useSession, organization } = authClient
```

### Route Guard (`src/components/partner-route-guard.jsx`)

- Vérifie `session.user.isPartner`
- Redirige vers `/auth/login` si non authentifié
- Redirige vers `/access-denied` si non-partenaire

---

## Client GraphQL

### Configuration (`src/lib/apollo-client.js`)

```javascript
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,  // http://localhost:4000/graphql
  cache: new InMemoryCache(),
  credentials: 'include'
})
```

### Opérations GraphQL

**Partenaire** (`src/graphql/partner.js`) :

| Query/Mutation | Description |
|----------------|-------------|
| `GET_PARTNER_STATS` | Stats complètes (earnings, referrals, history) |
| `GET_COMMISSION_TIERS` | Paliers de commission |
| `GET_WITHDRAWALS` | Historique retraits |
| `REQUEST_WITHDRAWAL` | Demande de retrait |
| `GET_PARTNER_REFERRALS` | Liste détaillée filleuls |

**Admin** (`src/graphql/admin.js`) :

| Query/Mutation | Description |
|----------------|-------------|
| `GET_ALL_WITHDRAWALS` | Tous les retraits (admin) |
| `APPROVE_WITHDRAWAL` | Approuver retrait |
| `REJECT_WITHDRAWAL` | Rejeter retrait |

---

## Composants

### shadcn/ui (`components/ui/`)

| Composant | Usage |
|-----------|-------|
| `button.tsx` | Boutons (variants) |
| `card.tsx` | Cartes container |
| `input.tsx` | Inputs + password |
| `dialog.tsx` | Modales |
| `sidebar.tsx` | Sidebar collapsible |
| `table.jsx` | Table données |
| `chart.tsx` | Wrapper Recharts |
| `tabs.tsx` | Navigation tabs |
| `badge.tsx` | Badges/tags |
| `skeleton.tsx` | Loading states |

### Composants Feature (`components/`)

| Composant | Description |
|-----------|-------------|
| `partner-navbar.tsx` | Navbar landing |
| `partner-footer.tsx` | Footer landing |
| `partner-sidebar.jsx` | Sidebar dashboard |
| `partner-header.jsx` | Header dashboard |
| `partner-nav-user.jsx` | Dropdown user |
| `partner-profile-modal.jsx` | Modal profil |
| `animated-shapes-background.tsx` | Background animé |

### Composants Dashboard

| Composant | Description |
|-----------|-------------|
| `stats-card.jsx` | KPI cards |
| `earnings-chart.jsx` | Chart earnings |
| `revenue-chart.jsx` | Chart revenue |
| `commission-tiers.jsx` | Progression tiers |
| `withdrawal-card.jsx` | Demande retrait |
| `withdrawal-history.jsx` | Historique retraits |
| `referral-link-display.jsx` | Lien parrainage |
| `referrals-table.jsx` | Table filleuls |

### Composants Admin (`components/admin/`)

| Composant | Description |
|-----------|-------------|
| `withdrawals-management.jsx` | Gestion retraits |

---

## Styling

### Tailwind CSS v4

**Configuration** : PostCSS + CSS custom properties

**Dark Mode** : Toujours activé (`dark` class sur html)

### Couleurs Brand

| Élément | Couleur |
|---------|---------|
| Primary | `#5b50FF` (violet) |
| Background | `#030303` (noir) |
| Bronze | Orange |
| Silver | Gris |
| Gold | Jaune |
| Platinum | Violet |

### Global CSS (`app/globals.css`)

- CSS variables pour thème (`--color-*`, `--radius`)
- Font families : Geist Sans, Geist Mono
- Animations via `tw-animate-css`

---

## Programme de Commission

### Paliers

| Tier | Commission | Conditions |
|------|------------|------------|
| **Bronze** | 20% | Départ |
| **Silver** | 25% | Critères atteints |
| **Gold** | 30% | Critères atteints |
| **Platinum** | 50% | Top partenaires |

### Dashboard Stats

- **Total Earnings** : Gains cumulés
- **Generated Revenue** : CA généré
- **Active Referrals** : Filleuls actifs
- **Commission Rate** : Taux actuel

---

## Fonctionnalités

### Landing Page (`/`)

- Hero section avec CTA
- Cards paliers de commission
- Section "Comment ça marche" (4 étapes)
- CTA vers produit Newbi

### Dashboard Partenaire (`/dashboard`)

1. **Stats Grid** : 4 KPI cards
2. **Charts** : Historique earnings/revenue (mensuel)
3. **Withdrawal** : Balance + formulaire demande
4. **Commission Tiers** : Progression vers palier suivant
5. **Withdrawal History** : Liste des demandes

### Page Referrals (`/dashboard/referrals`)

- Stats grid (mêmes KPIs)
- Table filleuls avec :
  - Nom, email, entreprise
  - Type abonnement, prix
  - Statut (actif/inactif)
  - Date inscription
  - Revenue généré
  - Commission gagnée

### Admin Withdrawals (`/admin/withdrawals`)

- Liste toutes demandes retraits
- Filtres par statut
- Actions approuver/rejeter
- Raison de rejet optionnelle

---

## Contexts

### Profile Modal Context (`src/contexts/profile-modal-context.jsx`)

État global pour modal édition profil

---

## Utilitaires

### Auth Utils (`src/lib/auth-utils.js`)

- Envoi emails (Resend API)
- Templates email (vérification, reset password)

### Admin Utils (`src/lib/admin-utils.js`)

```javascript
isAdminEmail(email)  // @sweily.fr, @newbi.fr
isAdmin(user)        // Vérifie rôle admin
```

### MongoDB (`src/lib/mongodb.js`)

- Pattern singleton (dev)
- Connexion fraîche (prod)

### Utils (`src/lib/utils.ts`)

```typescript
cn(...inputs)  // clsx + tailwind-merge
```

---

## Configuration

### Variables Environnement (`.env.local`)

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=newbi-affiliate

# Better Auth
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_SECRET=<secret>
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001

# GraphQL API
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

### Package.json

```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

### TypeScript (`tsconfig.json`)

- Target : ES2017
- Strict mode
- Path alias : `@/*` → root

### shadcn/ui (`components.json`)

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "neutral"
  }
}
```

---

## Flux de Données

### Authentification

```
User → Signup → Better Auth → MongoDB
                    ↓
            Vérifie isPartner
                    ↓
            Crée Organisation auto
                    ↓
            Session + JWT
                    ↓
            Redirect Dashboard
```

### Chargement Stats

```
Dashboard → useQuery(GET_PARTNER_STATS)
                    ↓
            Apollo Client → GraphQL API (4000)
                    ↓
            Resolvers → MongoDB
                    ↓
            Cache InMemoryCache
                    ↓
            Render Charts + Cards
```

### Demande Retrait

```
User → Formulaire Retrait
            ↓
    useMutation(REQUEST_WITHDRAWAL)
            ↓
    GraphQL API → Crée Withdrawal
            ↓
    Email notification admin
            ↓
    UI mise à jour
```

---

## Sécurité

| Couche | Mécanisme |
|--------|-----------|
| **Auth** | JWT + Better Auth |
| **Email** | Vérification requise |
| **Rate Limit** | 5 tentatives / 60s |
| **Route** | PartnerRouteGuard |
| **Admin** | Vérification domaine email |
| **Credentials** | Cookies (credentials: 'include') |

---

## Responsive Design

- **Mobile-first** avec breakpoints Tailwind
- **Sidebar** : Sheet (mobile), Fixed (desktop)
- **Navbar** : Layouts adaptatifs
- **Grids** : `sm:grid-cols-2`, `lg:grid-cols-4`
