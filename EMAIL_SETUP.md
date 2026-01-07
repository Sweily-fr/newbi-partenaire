# Configuration des Emails - Newbi Partner

## Variables d'environnement SMTP

Ajouter les variables suivantes dans votre fichier `.env.local` :

```env
# Configuration SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
SMTP_FROM=noreply@newbi.fr
```

## Configuration Gmail

Si vous utilisez Gmail, vous devez créer un **mot de passe d'application** :

1. Allez sur https://myaccount.google.com/security
2. Activez la validation en deux étapes si ce n'est pas déjà fait
3. Allez dans "Mots de passe des applications"
4. Créez un nouveau mot de passe pour "Autre (nom personnalisé)"
5. Nommez-le "Newbi Partner"
6. Copiez le mot de passe généré dans `SMTP_PASS`

## Autres fournisseurs SMTP

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=votre-api-key-sendgrid
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@votre-domaine.mailgun.org
SMTP_PASS=votre-mot-de-passe-mailgun
```

### Amazon SES
```env
SMTP_HOST=email-smtp.eu-west-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-access-key-id
SMTP_PASS=votre-secret-access-key
```

## Fonctionnement

Lors d'une demande de retrait :

1. **Email au partenaire** (`partner-withdrawal-confirmation.jsx`)
   - Confirmation de la demande
   - Récapitulatif du retrait
   - Coordonnées bancaires
   - Statut et délai de traitement

2. **Email à l'admin** (`admin-withdrawal-notification.jsx`)
   - Notification de nouvelle demande
   - Informations du partenaire
   - Détails du retrait
   - Coordonnées bancaires pour le virement

## Test des emails

Utilisez le script de test pour vérifier la configuration :

```bash
node scripts/test-withdrawal-emails.js
```

## Templates React Email

Les templates sont dans le dossier `/emails` :
- `partner-withdrawal-confirmation.jsx` - Email au partenaire
- `admin-withdrawal-notification.jsx` - Email à l'admin

Pour prévisualiser les templates en développement :

```bash
npm run email:dev
```

Puis ouvrez http://localhost:3000 pour voir les templates.

## Dépannage

### Erreur "Invalid login"
- Vérifiez que vous utilisez un mot de passe d'application (Gmail)
- Vérifiez que les credentials sont corrects

### Erreur "Connection timeout"
- Vérifiez le port SMTP (587 pour TLS, 465 pour SSL)
- Vérifiez que `SMTP_SECURE` est correct (false pour 587, true pour 465)

### Emails non reçus
- Vérifiez les spams
- Vérifiez les logs de la console
- Testez avec le script de test

## Sécurité

⚠️ **Important** :
- Ne committez JAMAIS vos credentials SMTP
- Utilisez des mots de passe d'application, pas votre mot de passe principal
- Ajoutez `.env.local` dans `.gitignore`
- En production, utilisez des variables d'environnement sécurisées
