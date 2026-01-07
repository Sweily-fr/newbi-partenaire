/**
 * Script de test pour les emails de retrait
 * 
 * Usage: node scripts/test-withdrawal-emails.js
 */

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

console.log('\n╔════════════════════════════════════════╗');
console.log('║  Test des Emails de Retrait - Newbi   ║');
console.log('╚════════════════════════════════════════╝\n');

/**
 * Vérification de la configuration SMTP
 */
function checkConfig() {
  console.log('🔍 Vérification de la configuration SMTP...\n');
  
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n📝 Consultez EMAIL_SETUP.md pour la configuration\n');
    process.exit(1);
  }
  
  console.log('✅ Configuration SMTP trouvée:');
  console.log(`   Host: ${process.env.SMTP_HOST}`);
  console.log(`   Port: ${process.env.SMTP_PORT || '587'}`);
  console.log(`   User: ${process.env.SMTP_USER}`);
  console.log(`   From: ${process.env.SMTP_FROM || process.env.SMTP_USER}`);
  console.log('');
}

/**
 * Création du transporteur SMTP
 */
function createTransporter() {
  const createTransportFn = nodemailer.createTransport || nodemailer.default?.createTransport;
  
  if (!createTransportFn) {
    throw new Error('nodemailer.createTransport n\'est pas disponible. Vérifiez l\'installation de nodemailer.');
  }
  
  return createTransportFn.call(nodemailer, {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Test de connexion SMTP
 */
async function testConnection(transporter) {
  console.log('🔌 Test de connexion SMTP...\n');
  
  try {
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie\n');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion SMTP:');
    console.error(`   ${error.message}\n`);
    return false;
  }
}

/**
 * HTML pour l'email de test au partenaire
 */
function getPartnerEmailHTML(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirmation de retrait</title>
</head>
<body style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif; background: #ffffff; margin: 0; padding: 0;">
  <div style="max-width: 580px; margin: 0 auto; padding: 20px 0 48px;">
    <div style="padding: 32px 0; text-align: center;">
      <img src="https://pub-866a54f5560d449cb224411e60410621.r2.dev/Logo_Texte_Black.png" alt="Newbi" width="120">
    </div>
    
    <div style="padding: 0 40px;">
      <h1 style="color: #000000; font-size: 24px; font-weight: 600; margin: 30px 0 20px; line-height: 1.3;">Demande de retrait confirmée</h1>
      
      <p style="color: #000000; font-size: 14px; line-height: 24px; margin: 16px 0;">
        Bonjour ${data.partnerName},
      </p>

      <p style="color: #000000; font-size: 14px; line-height: 24px; margin: 16px 0;">
        Nous avons bien reçu votre demande de retrait de <strong>${data.amount.toFixed(2)}€</strong>.
      </p>

      <div style="margin: 32px 0;">
        <p style="color: #000000; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Détails de la demande</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">Numéro de demande</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">${data.withdrawalId}</td>
          </tr>
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">Montant</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">${data.amount.toFixed(2)}€</td>
          </tr>
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">Date</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">${data.requestDate}</td>
          </tr>
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">Méthode</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">Virement bancaire</td>
          </tr>
        </table>
      </div>

      <div style="margin: 32px 0;">
        <p style="color: #000000; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Coordonnées bancaires</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">Titulaire</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">${data.bankDetails.accountHolder}</td>
          </tr>
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">IBAN</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">${data.bankDetails.iban}</td>
          </tr>
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">BIC</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">${data.bankDetails.bic}</td>
          </tr>
        </table>
      </div>

      <p style="color: #000000; font-size: 14px; line-height: 24px; margin: 16px 0;">
        Votre demande sera traitée sous 3 à 5 jours ouvrés. Vous recevrez une notification par email une fois le virement effectué.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

      <p style="color: #666666; font-size: 12px; line-height: 20px; text-align: center; margin: 16px 0 8px;">
        Si vous avez des questions, contactez-nous à <a href="mailto:contact@newbi.fr" style="color: #5b50ff; text-decoration: none;">contact@newbi.fr</a>
      </p>

      <p style="color: #999999; font-size: 12px; line-height: 20px; text-align: center; margin: 8px 0;">
        © 2025 Newbi Partner. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * HTML simple pour l'email admin
 */
function getAdminEmailHTML(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nouvelle demande de retrait</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <img src="https://pub-866a54f5560d449cb224411e60410621.r2.dev/Logo_Texte_Black.png" alt="Newbi" width="120">
  </div>
  
  <h1 style="color: #1f2937; text-align: center;">Nouvelle demande de retrait</h1>
  
  <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
    <p style="margin: 0; color: #991b1b; font-weight: 600;">Une nouvelle demande de retrait nécessite votre attention</p>
  </div>
  
  <h2 style="font-size: 18px; margin-top: 30px;">Informations du partenaire</h2>
  <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 15px 0;">
    <table style="width: 100%;">
      <tr>
        <td style="color: #6b7280; padding: 8px 0;">Nom :</td>
        <td style="font-weight: 600; padding: 8px 0;">${data.partnerName}</td>
      </tr>
      <tr>
        <td style="color: #6b7280; padding: 8px 0;">Email :</td>
        <td style="font-weight: 600; padding: 8px 0;">${data.partnerEmail}</td>
      </tr>
      <tr>
        <td style="color: #6b7280; padding: 8px 0;">ID Partenaire :</td>
        <td style="font-weight: 600; padding: 8px 0;">${data.partnerId}</td>
      </tr>
      <tr>
        <td style="color: #6b7280; padding: 8px 0;">Solde disponible :</td>
        <td style="font-weight: 600; padding: 8px 0;">${data.availableBalance.toFixed(2)}€</td>
      </tr>
      <tr>
        <td style="color: #6b7280; padding: 8px 0;">Gains totaux :</td>
        <td style="font-weight: 600; padding: 8px 0;">${data.totalEarnings.toFixed(2)}€</td>
      </tr>
    </table>
  </div>
  
  <h2 style="font-size: 18px; margin-top: 30px;">Détails du retrait</h2>
  <div style="background: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 20px; margin: 15px 0;">
    <table style="width: 100%;">
      <tr>
        <td style="color: #6b7280; padding: 8px 0;">Numéro de demande :</td>
        <td style="font-weight: 600; padding: 8px 0;">${data.withdrawalId}</td>
      </tr>
      <tr>
        <td style="color: #6b7280; padding: 8px 0;">Montant demandé :</td>
        <td style="font-weight: bold; color: #5b50ff; font-size: 18px; padding: 8px 0;">${data.amount.toFixed(2)}€</td>
      </tr>
      <tr>
        <td style="color: #6b7280; padding: 8px 0;">Date de demande :</td>
        <td style="font-weight: 600; padding: 8px 0;">${data.requestDate}</td>
      </tr>
    </table>
  </div>
  
  <h2 style="font-size: 18px; margin-top: 30px;">Coordonnées bancaires</h2>
  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 15px 0;">
    <table style="width: 100%;">
      <tr>
        <td style="color: #6b7280; padding: 8px 0;">Titulaire :</td>
        <td style="font-weight: 600; padding: 8px 0;">${data.bankDetails.accountHolder}</td>
      </tr>
      <tr>
        <td style="color: #6b7280; padding: 8px 0;">IBAN :</td>
        <td style="font-weight: 600; padding: 8px 0;">${data.bankDetails.iban}</td>
      </tr>
      <tr>
        <td style="color: #6b7280; padding: 8px 0;">BIC :</td>
        <td style="font-weight: 600; padding: 8px 0;">${data.bankDetails.bic}</td>
      </tr>
    </table>
  </div>
  
  <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <p style="margin: 0 0 10px 0; color: #92400e;">Veuillez traiter cette demande dans les 3 à 5 jours ouvrés.</p>
    <p style="margin: 0; color: #92400e;">Une fois le virement effectué, pensez à mettre à jour le statut dans le dashboard.</p>
  </div>
  
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
  
  <p style="text-align: center; color: #6b7280; font-size: 14px;">
    Cet email a été envoyé automatiquement par le système Newbi Partner.
  </p>
</body>
</html>
  `;
}

/**
 * Données de test
 */
const testData = {
  partnerName: 'Jean Dupont',
  partnerEmail: process.env.TEST_EMAIL || 'joaquim.gameiro@sweily.fr',
  partnerId: 'P-123456',
  amount: 150.00,
  requestDate: new Date().toLocaleDateString('fr-FR'),
  withdrawalId: 'WD-TEST-001',
  bankDetails: {
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'BNPAFRPPXXX',
    accountHolder: 'Jean Dupont',
  },
  availableBalance: 250.00,
  totalEarnings: 500.00,
};

/**
 * Envoi de l'email au partenaire
 */
async function sendPartnerEmail(transporter) {
  console.log('📧 Envoi de l\'email au partenaire...\n');
  
  try {
    const html = getPartnerEmailHTML(testData);
    
    const info = await transporter.sendMail({
      from: `"Newbi Partner" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: testData.partnerEmail,
      subject: `[TEST] Confirmation de votre demande de retrait - ${testData.withdrawalId}`,
      html,
    });
    
    console.log('✅ Email partenaire envoyé avec succès');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Destinataire: ${testData.partnerEmail}\n`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email partenaire:');
    console.error(`   ${error.message}\n`);
    return false;
  }
}

/**
 * Envoi de l'email à l'admin
 */
async function sendAdminEmail(transporter) {
  console.log('📧 Envoi de l\'email à l\'admin...\n');
  
  try {
    const html = getAdminEmailHTML(testData);
    
    const info = await transporter.sendMail({
      from: `"Newbi Partner System" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: 'contact@newbi.fr',
      subject: `[TEST] Nouvelle demande de retrait - ${testData.partnerName} (${testData.withdrawalId})`,
      html,
    });
    
    console.log('✅ Email admin envoyé avec succès');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Destinataire: contact@newbi.fr\n`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email admin:');
    console.error(`   ${error.message}\n`);
    return false;
  }
}

/**
 * Fonction principale
 */
async function main() {
  // Vérification de la configuration
  checkConfig();
  
  // Création du transporteur
  const transporter = createTransporter();
  
  // Test de connexion
  const connected = await testConnection(transporter);
  if (!connected) {
    console.log('❌ Test échoué: impossible de se connecter au serveur SMTP\n');
    process.exit(1);
  }
  
  // Envoi des emails avec délai pour éviter les limites de rate
  const partnerSent = await sendPartnerEmail(transporter);
  
  // Attendre 5 secondes avant d'envoyer le second email (limite Mailtrap)
  if (partnerSent) {
    console.log('⏳ Attente de 5 secondes avant l\'envoi du second email...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  const adminSent = await sendAdminEmail(transporter);
  
  // Résumé
  console.log('═══════════════════════════════════════\n');
  console.log('📊 Résumé des tests:\n');
  console.log(`   Connexion SMTP: ${connected ? '✅' : '❌'}`);
  console.log(`   Email partenaire: ${partnerSent ? '✅' : '❌'}`);
  console.log(`   Email admin: ${adminSent ? '✅' : '❌'}\n`);
  
  if (partnerSent && adminSent) {
    console.log('✅ Tous les tests ont réussi!\n');
    console.log('📬 Vérifiez vos boîtes mail:');
    console.log(`   - ${testData.partnerEmail}`);
    console.log(`   - contact@newbi.fr\n`);
  } else {
    console.log('❌ Certains tests ont échoué\n');
    console.log('💡 Consultez EMAIL_SETUP.md pour le dépannage\n');
    process.exit(1);
  }
}

// Exécution
main().catch(error => {
  console.error('\n❌ Erreur fatale:', error);
  process.exit(1);
});
