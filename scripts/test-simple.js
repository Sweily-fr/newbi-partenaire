console.log('Script démarré');

const nodemailer = require('nodemailer');
console.log('Nodemailer chargé');

const dotenv = require('dotenv');
console.log('Dotenv chargé');

const path = require('path');
console.log('Path chargé');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
console.log('Variables d\'environnement chargées');

console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASSWORD présent:', !!process.env.SMTP_PASSWORD);

console.log('\nScript terminé');
