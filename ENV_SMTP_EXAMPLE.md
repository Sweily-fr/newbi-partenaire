# Configuration SMTP - Variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Configuration SMTP pour l'envoi d'emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
SMTP_FROM=noreply@newbi.fr

# Email de test (optionnel)
TEST_EMAIL=votre-email-test@example.com
```

## Production

Pour la production, ajoutez ces variables dans votre hébergement (Vercel, etc.) :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@newbi.fr
SMTP_PASS=mot-de-passe-application-gmail
SMTP_FROM=noreply@newbi.fr
```

## Notes

- L'email admin est hardcodé à `contact@newbi.fr` dans le code
- Le partenaire reçoit l'email sur l'adresse de son compte
- Les deux emails sont envoyés automatiquement lors d'une demande de retrait
