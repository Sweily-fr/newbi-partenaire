import { NextResponse } from 'next/server';
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import PartnerWithdrawalConfirmation from '@/emails/partner-withdrawal-confirmation';
import AdminWithdrawalNotification from '@/emails/admin-withdrawal-notification';

/**
 * Configuration du transporteur SMTP
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true pour port 465, false pour autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * POST /api/emails/send-withdrawal-notification
 * Envoie les emails de notification de retrait au partenaire et à l'admin
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      partnerName,
      partnerEmail,
      partnerId,
      amount,
      requestDate,
      withdrawalId,
      bankDetails,
      availableBalance,
      totalEarnings,
    } = body;

    // Validation des données requises
    if (!partnerName || !partnerEmail || !amount || !withdrawalId || !bankDetails) {
      return NextResponse.json(
        { error: 'Données manquantes pour l\'envoi des emails' },
        { status: 400 }
      );
    }

    // Vérification de la configuration SMTP
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Configuration SMTP manquante');
      return NextResponse.json(
        { error: 'Configuration email non disponible' },
        { status: 500 }
      );
    }

    const transporter = createTransporter();

    // Rendu des templates React Email en HTML
    const partnerEmailHtml = await render(
      PartnerWithdrawalConfirmation({
        partnerName,
        amount,
        requestDate,
        withdrawalId,
        bankDetails,
      })
    );

    const adminEmailHtml = await render(
      AdminWithdrawalNotification({
        partnerName,
        partnerEmail,
        partnerId,
        amount,
        requestDate,
        withdrawalId,
        bankDetails,
        availableBalance,
        totalEarnings,
      })
    );

    // Envoi de l'email au partenaire
    const partnerEmailResult = await transporter.sendMail({
      from: `"Newbi Partner" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: partnerEmail,
      subject: `Confirmation de votre demande de retrait - ${withdrawalId}`,
      html: partnerEmailHtml,
    });

    console.log('Email partenaire envoyé:', partnerEmailResult.messageId);

    // Envoi de l'email à l'admin
    const adminEmailResult = await transporter.sendMail({
      from: `"Newbi Partner System" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: 'contact@newbi.fr',
      subject: `Nouvelle demande de retrait - ${partnerName} (${withdrawalId})`,
      html: adminEmailHtml,
    });

    console.log('Email admin envoyé:', adminEmailResult.messageId);

    return NextResponse.json({
      success: true,
      message: 'Emails envoyés avec succès',
      partnerEmailId: partnerEmailResult.messageId,
      adminEmailId: adminEmailResult.messageId,
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi des emails:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'envoi des emails',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
