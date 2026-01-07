# Différences d'authentification entre NewbiV2 et newbi-afilliate

## 📊 Vue d'ensemble

| Fonctionnalité | NewbiV2 | newbi-afilliate | Notes |
|----------------|---------|-----------------|-------|
| **Plugins** | 6 plugins | 2 plugins | Afilliate plus simple |
| **OAuth** | ✅ Google, GitHub | ❌ Aucun | Partenaires email uniquement |
| **2FA** | ✅ Activé | ❌ Désactivé | Sécurité réduite pour partenaires |
| **Trial** | ✅ 14 jours | ❌ Aucun | Pas de trial pour partenaires |
| **Vérification isPartner** | ❌ Non | ✅ Oui | Restriction d'accès |
| **Hooks personnalisés** | ✅ beforeSignInHook, afterOAuthHook | ❌ Aucun | |

---

## 🔌 Plugins

### NewbiV2 (6 plugins)
```javascript
plugins: [
  jwt(),
  adminPlugin,           // ❌ Manquant dans afilliate
  phoneNumberPlugin,     // ❌ Manquant dans afilliate
  twoFactorPlugin,       // ❌ Manquant dans afilliate
  stripePlugin,          // ❌ Manquant dans afilliate
  organizationPlugin,    // ✅ Présent
  multiSessionPlugin,    // ❌ Manquant dans afilliate
]
```

### newbi-afilliate (2 plugins)
```javascript
plugins: [
  jwt(),                 // ✅ Présent
  organizationPlugin,    // ✅ Présent
]
```

**Impact :** L'interface partenaire est plus simple, sans 2FA, sans gestion admin, sans Stripe.

---

## 🔐 beforeSignIn Hook

### NewbiV2
```javascript
async beforeSignIn({ user }) {
  // 1. Vérifier si le compte est actif
  if (user.isActive === false) {
    await sendReactivationEmail(user);
    throw new Error("Compte désactivé. Email de réactivation envoyé.");
  }

  // 2. Vérifier si l'email est vérifié
  if (!user.emailVerified) {
    throw new Error("Veuillez vérifier votre email.");
  }

  return user;
}
```

### newbi-afilliate
```javascript
async beforeSignIn({ user }) {
  // 1. ✅ VÉRIFICATION CRITIQUE : Seuls les partenaires
  if (!user.isPartner) {
    throw new Error("Accès refusé. Vous devez être un partenaire.");
  }

  // 2. Vérifier si le compte est actif
  if (user.isActive === false) {
    throw new Error("Compte partenaire désactivé.");
  }

  // 3. ✅ Vérifier si l'email est vérifié
  if (!user.emailVerified) {
    throw new Error("Veuillez vérifier votre email.");
  }

  return user;
}
```

**Différences clés :** 
- L'interface partenaire vérifie `isPartner` pour restreindre l'accès
- Les deux vérifient maintenant `emailVerified`
- NewbiV2 envoie un email de réactivation si compte désactivé

---

## 👤 Champs utilisateur additionnels

### NewbiV2
```javascript
user: {
  additionalFields: {
    name: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    createdBy: { type: "string" },          // ❌ Manquant dans afilliate
    avatar: { type: "string" },
    isActive: { type: "boolean" },
    redirect_after_login: { type: "string" }, // ❌ Manquant dans afilliate
    hasSeenOnboarding: { type: "boolean" },   // ❌ Manquant dans afilliate
    referralCode: { type: "string" },
  }
}
```

### newbi-afilliate
```javascript
user: {
  additionalFields: {
    name: { type: "string" },
    lastName: { type: "string" },
    phoneNumber: { type: "string" },
    company: { type: "string" },           // ✅ Nouveau champ
    avatar: { type: "string" },
    isActive: { type: "boolean" },
    isPartner: { type: "boolean" },        // ✅ Nouveau champ
    referralCode: { type: "string" },
  }
}
```

**Différences :**
- ✅ Afilliate ajoute : `isPartner`, `company`
- ❌ Afilliate n'a pas : `createdBy`, `redirect_after_login`, `hasSeenOnboarding`

---

## 🏢 Création d'organisation

### NewbiV2
```javascript
// Créer l'organisation avec TRIAL
const orgResult = await mongoDb.collection("organization").insertOne({
  name: organizationName,
  slug: organizationSlug,
  logo: null,
  metadata: {
    autoCreated: true,
    createdAt: now.toISOString(),
    createdVia: user.accounts?.[0]?.providerId || "email",
  },
  trialStartDate: now,              // ✅ Trial activé
  trialEndDate: trialEnd,           // ✅ 14 jours
  isTrialActive: true,              // ✅ Trial actif
  hasUsedTrial: true,               // ✅ Trial utilisé
  createdAt: now,
});
```

### newbi-afilliate
```javascript
// Créer l'organisation SANS trial
const orgResult = await mongoDb.collection("organization").insertOne({
  name: organizationName,
  slug: organizationSlug,
  logo: null,
  metadata: {
    autoCreated: true,
    createdAt: now.toISOString(),
    isPartnerOrg: true,             // ✅ Marqueur partenaire
  },
  createdAt: now,
  // ❌ Pas de trial pour les partenaires
});
```

**Différence clé :** Les partenaires n'ont pas de période d'essai.

---

## 🔑 OAuth / Social Login

### NewbiV2
```javascript
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
}
```

### newbi-afilliate
```javascript
// ❌ Aucun provider OAuth
// Les partenaires doivent utiliser email/password uniquement
```

**Impact :** Interface partenaire plus simple, authentification email uniquement.

---

## 📧 Vérification d'email

### Similitudes ✅
- `requireEmailVerification: true` dans les deux
- `sendOnSignUp: true` dans les deux
- `autoSignInAfterVerification: true` dans les deux
- `expiresIn: 3600` (1 heure) dans les deux

### Différences
- **NewbiV2** : Vérifie et corrige la session si `activeOrganizationId` manque
- **newbi-afilliate** : Vérifie seulement l'existence de l'organisation

---

## 🔒 Hooks personnalisés

### NewbiV2
```javascript
hooks: {
  before: beforeSignInHook,    // Hook personnalisé
  after: afterOAuthHook,       // Hook OAuth
}
```

### newbi-afilliate
```javascript
// ❌ Aucun hook personnalisé
// Logique directement dans beforeSignIn
```

---

## 🎯 Recommandations

### À ajouter dans newbi-afilliate si nécessaire :

1. **Multi-session** : Si les partenaires ont besoin de plusieurs sessions actives
2. **2FA** : Pour renforcer la sécurité des comptes partenaires
3. **Phone number** : Si vous voulez collecter les numéros de téléphone
4. **Admin plugin** : Si vous avez besoin de rôles admin pour les partenaires
5. **Stripe plugin** : Si les partenaires ont des paiements à gérer

### À garder simple :

- ✅ Pas d'OAuth (email uniquement)
- ✅ Pas de trial (les partenaires ont un accès direct)
- ✅ Vérification `isPartner` stricte
- ✅ Organisation marquée `isPartnerOrg: true`

---

## 📋 Checklist de sécurité

| Sécurité | NewbiV2 | newbi-afilliate |
|----------|---------|-----------------|
| Vérification email | ✅ | ✅ |
| Vérification emailVerified | ✅ | ✅ |
| Rate limiting | ✅ (5/min) | ✅ (5/min) |
| 2FA | ✅ | ❌ |
| Vérification isActive | ✅ | ✅ |
| Vérification isPartner | ❌ | ✅ |
| Session expiration | ✅ 30j | ✅ 30j |
| Cookie cache | ✅ 5min | ✅ 5min |

---

## 🚀 Conclusion

L'interface partenaire est **volontairement plus simple** que NewbiV2 :
- Moins de plugins
- Pas d'OAuth
- Pas de 2FA
- Pas de trial
- Vérification stricte `isPartner`

Cette simplicité est **appropriée** pour une interface dédiée aux partenaires qui n'ont pas besoin de toutes les fonctionnalités de l'application principale.
