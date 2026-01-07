/**
 * Script de test pour l'email admin uniquement
 * 
 * Usage: node scripts/test-admin-email.js
 */

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

console.log('\n╔════════════════════════════════════════╗');
console.log('║  Test Email Admin - Newbi Partner     ║');
console.log('╚════════════════════════════════════════╝\n');

/**
 * Création du transporteur SMTP
 */
function createTransporter() {
  const createTransportFn = nodemailer.createTransport || nodemailer.default?.createTransport;
  
  if (!createTransportFn) {
    throw new Error('nodemailer.createTransport n\'est pas disponible.');
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
 * HTML pour l'email admin
 */
function getAdminEmailHTML(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nouvelle demande de retrait</title>
</head>
<body style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif; background: #ffffff; margin: 0; padding: 0;">
  <div style="max-width: 580px; margin: 0 auto; padding: 20px 0 48px;">
    <div style="padding: 32px 0; text-align: center;">
      <img src="https://pub-866a54f5560d449cb224411e60410621.r2.dev/Logo_Texte_Black.png" alt="Newbi" width="120">
    </div>
    
    <div style="padding: 0 40px;">
      <h1 style="color: #000000; font-size: 24px; font-weight: 600; margin: 30px 0 20px; line-height: 1.3;">Nouvelle demande de retrait</h1>
      
      <p style="color: #000000; font-size: 14px; line-height: 24px; margin: 16px 0;">
        Une nouvelle demande de retrait de <strong>${data.amount.toFixed(2)}€</strong> a été effectuée par ${data.partnerName}.
      </p>

      <div style="margin: 32px 0;">
        <p style="color: #000000; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Informations du partenaire</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">Nom</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">${data.partnerName}</td>
          </tr>
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">Email</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">${data.partnerEmail}</td>
          </tr>
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">ID Partenaire</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">${data.partnerId}</td>
          </tr>
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">Solde disponible</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">${data.availableBalance.toFixed(2)}€</td>
          </tr>
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">Gains totaux</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">${data.totalEarnings.toFixed(2)}€</td>
          </tr>
        </table>
      </div>

      <div style="margin: 32px 0;">
        <p style="color: #000000; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">Détails du retrait</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">Numéro de demande</td>
            <td style="color: #000000; font-size: 14px; padding: 8px 0; vertical-align: top;">${data.withdrawalId}</td>
          </tr>
          <tr>
            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 40%; vertical-align: top;">Montant</td>
            <td style="color: #5b50ff; font-size: 16px; font-weight: 600; padding: 8px 0; vertical-align: top;">${data.amount.toFixed(2)}€</td>
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
        Veuillez traiter cette demande dans les 3 à 5 jours ouvrés.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

      <p style="color: #666666; font-size: 12px; line-height: 20px; text-align: center; margin: 16px 0;">
        Cet email a été envoyé automatiquement par le système Newbi Partner.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

const testData = {
  partnerName: 'Jean Dupont',
  partnerEmail: 'joaquim.gameiro@sweily.fr',
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

async function main() {
  console.log('📧 Envoi de l\'email à l\'admin...\n');
  
  try {
    const transporter = createTransporter();
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
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();
