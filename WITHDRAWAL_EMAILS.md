# Système d'Emails de Retrait - Newbi Partner

## Vue d'ensemble

Lors d'une demande de retrait par un partenaire, le système envoie automatiquement deux emails :

1. **Email au partenaire** - Confirmation de la demande avec récapitulatif
2. **Email à l'admin** (`contact@newbi.fr`) - Notification avec toutes les informations nécessaires

## Architecture

```
Demande de retrait (withdrawal-card.jsx)
    ↓
Mutation GraphQL (REQUEST_WITHDRAWAL)
    ↓
API Route Next.js (/api/emails/send-withdrawal-notification)
    ↓
Templates React Email + Nodemailer SMTP
    ↓
Emails envoyés
```

## Fichiers créés

### Templates d'emails (React Email)

- **`/emails/partner-withdrawal-confirmation.jsx`**
  - Email de confirmation au partenaire
  - Récapitulatif de la demande
  - Coordonnées bancaires
  - Statut et délai de traitement

- **`/emails/admin-withdrawal-notification.jsx`**
  - Notification à l'admin
  - Informations complètes du partenaire
  - Détails du retrait
  - Coordonnées bancaires pour effectuer le virement

### API Route

- **`/app/api/emails/send-withdrawal-notification/route.js`**
  - Endpoint POST pour l'envoi des emails
  - Utilise nodemailer pour SMTP
  - Rend les templates React Email en HTML
  - Envoie les deux emails en parallèle

### Composant modifié

- **`/components/withdrawal-card.jsx`**
  - Appelle l'API route après la création de la demande
  - Gère les erreurs d'envoi sans bloquer le processus
  - Affiche des notifications appropriées

### Scripts et documentation

- **`/scripts/test-withdrawal-emails.js`** - Script de test complet
- **`EMAIL_SETUP.md`** - Guide de configuration SMTP
- **`ENV_SMTP_EXAMPLE.md`** - Variables d'environnement

## Configuration

### 1. Variables d'environnement

Ajoutez dans `.env.local` :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@newbi.fr
SMTP_PASSWORD=votre-mot-de-passe-application
SMTP_FROM=noreply@newbi.fr
```

### 2. Configuration Gmail

1. Activez la validation en deux étapes
2. Créez un mot de passe d'application
3. Utilisez ce mot de passe dans `SMTP_PASSWORD`

Voir `EMAIL_SETUP.md` pour plus de détails.

## Test

### Test local

```bash
node scripts/test-withdrawal-emails.js
```

Ce script :
- Vérifie la configuration SMTP
- Teste la connexion
- Envoie les deux emails de test
- Affiche un rapport détaillé

### Test en développement

1. Lancez le serveur : `npm run dev`
2. Connectez-vous au dashboard partenaire
3. Faites une demande de retrait
4. Vérifiez vos emails

## Flux utilisateur

### Côté partenaire

1. Le partenaire remplit le formulaire de retrait
2. Clique sur "Demander le retrait"
3. La demande est créée dans la base de données
4. Un email de confirmation est envoyé au partenaire
5. Le partenaire voit un toast de succès

### Côté admin

1. Un email de notification arrive à `contact@newbi.fr`
2. L'email contient :
   - Informations du partenaire (nom, email, ID)
   - Montant demandé
   - Coordonnées bancaires pour le virement
   - Solde et gains totaux du partenaire
3. L'admin peut traiter le retrait

## Contenu des emails

### Email partenaire

**Sujet** : `Confirmation de votre demande de retrait - WD-XXXXXX`

**Contenu** :
- Message de bienvenue personnalisé
- Numéro de demande
- Montant
- Date de demande
- Méthode (virement bancaire)
- Coordonnées bancaires
- Statut et délai de traitement (3-5 jours)
- Contact support

### Email admin

**Sujet** : `Nouvelle demande de retrait - [Nom] (WD-XXXXXX)`

**Contenu** :
- Alerte de nouvelle demande
- Informations du partenaire :
  - Nom
  - Email
  - ID partenaire
  - Solde disponible
  - Gains totaux
- Détails du retrait :
  - Numéro de demande
  - Montant (en gros)
  - Date
  - Méthode
- Coordonnées bancaires complètes
- Rappel du délai de traitement

## Gestion des erreurs

Le système est conçu pour être résilient :

- Si l'envoi des emails échoue, la demande de retrait est quand même enregistrée
- Un toast warning informe l'utilisateur
- Les erreurs sont loggées dans la console
- Le processus n'est jamais bloqué par un problème d'email

## Sécurité

- Les credentials SMTP ne sont jamais exposés côté client
- L'API route est protégée (Next.js API routes)
- Les emails sont envoyés via SMTP sécurisé (TLS)
- Les mots de passe d'application Gmail sont recommandés

## Personnalisation

### Modifier les templates

Les templates sont dans `/emails/` et utilisent React Email :

```jsx
import { Html, Body, Container, Text } from '@react-email/components';

export const MonTemplate = ({ data }) => (
  <Html>
    <Body>
      <Container>
        <Text>Contenu personnalisé</Text>
      </Container>
    </Body>
  </Html>
);
```

### Modifier l'adresse admin

Dans `/app/api/emails/send-withdrawal-notification/route.js`, ligne 97 :

```javascript
to: 'contact@newbi.fr', // Changez ici
```

### Ajouter des destinataires

Pour envoyer à plusieurs admins :

```javascript
to: ['contact@newbi.fr', 'admin@newbi.fr'].join(', '),
```

## Dépannage

### Emails non reçus

1. Vérifiez les spams
2. Vérifiez les logs de la console
3. Testez avec le script : `node scripts/test-withdrawal-emails.js`
4. Vérifiez la configuration SMTP

### Erreur "Invalid login"

- Utilisez un mot de passe d'application (Gmail)
- Vérifiez les credentials dans `.env.local`

### Erreur "Connection timeout"

- Vérifiez le port (587 pour TLS)
- Vérifiez `SMTP_SECURE=false` pour le port 587

Voir `EMAIL_SETUP.md` pour plus de solutions.

## Prochaines étapes

- [ ] Configurer les variables SMTP en production
- [ ] Tester en production avec un vrai retrait
- [ ] Ajouter des templates pour d'autres événements (retrait traité, etc.)
- [ ] Implémenter un système de queue pour les emails (optionnel)
- [ ] Ajouter des analytics d'emails (optionnel)
