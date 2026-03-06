import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

// Infos destinataire (Sweily) — identiques pour les deux modèles
const RECIPIENT = {
  name: 'Sweily SAS',
  email: 'contact@newbi.fr',
  tva: 'FR70981576549',
  siren: '981576549',
  address: '229 rue Saint-Honoré, 75001 Paris',
};

/**
 * GET /api/generate-invoice-template?partnerName=...&amount=...&type=pro|particulier
 * Génère un modèle de facture PDF pré-rempli pour le partenaire
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerName = searchParams.get('partnerName') || 'Nom du partenaire';
    const amount = searchParams.get('amount') || '0.00';
    const type = searchParams.get('type') || 'particulier';
    const today = new Date().toLocaleDateString('fr-FR');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- En-tête ---
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE', pageWidth / 2, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('Modèle de facture - Commission partenaire Newbi', pageWidth / 2, 33, { align: 'center' });
    doc.setTextColor(0);

    // Ligne séparatrice
    doc.setDrawColor(91, 80, 255);
    doc.setLineWidth(0.8);
    doc.line(20, 38, pageWidth - 20, 38);

    // --- Infos émetteur (partenaire) ---
    let y = 48;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Émetteur :', 20, y);
    doc.setFont('helvetica', 'normal');
    y += 7;
    doc.text(partnerName, 20, y);
    y += 6;
    doc.text('Adresse : ___________________________________', 20, y);

    if (type === 'pro') {
      y += 6;
      doc.text('SIRET : ___________________________________', 20, y);
      y += 6;
      doc.text('N° TVA : ___________________________________', 20, y);
    }

    y += 6;
    doc.text('Email : ___________________________________', 20, y);

    // --- Infos destinataire ---
    const rightX = pageWidth / 2 + 10;
    let yRight = 48;
    doc.setFont('helvetica', 'bold');
    doc.text('Destinataire :', rightX, yRight);
    doc.setFont('helvetica', 'normal');
    yRight += 7;
    doc.text(RECIPIENT.name, rightX, yRight);
    yRight += 6;
    doc.text(RECIPIENT.address, rightX, yRight);
    yRight += 6;
    doc.text(`N° TVA : ${RECIPIENT.tva}`, rightX, yRight);
    yRight += 6;
    doc.text(`N° SIREN : ${RECIPIENT.siren}`, rightX, yRight);
    yRight += 6;
    doc.text(RECIPIENT.email, rightX, yRight);

    // --- Infos facture ---
    const infoY = Math.max(y, yRight) + 15;
    y = infoY;
    doc.setFont('helvetica', 'bold');
    doc.text('Date :', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(today, 55, y);
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('N° Facture :', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text('_________________', 55, y);

    // --- Tableau ---
    y += 15;
    // En-tête du tableau
    doc.setFillColor(91, 80, 255);
    doc.rect(20, y, pageWidth - 40, 10, 'F');
    doc.setTextColor(255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Description', 25, y + 7);
    doc.text(type === 'pro' ? 'Montant HT' : 'Montant', pageWidth - 25, y + 7, { align: 'right' });
    doc.setTextColor(0);

    // Ligne du tableau
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setDrawColor(200);
    doc.rect(20, y, pageWidth - 40, 12);
    doc.text('Commission partenaire Newbi', 25, y + 8);
    doc.text(`${amount} EUR`, pageWidth - 25, y + 8, { align: 'right' });

    // --- Totaux ---
    y += 20;

    if (type === 'pro') {
      const amountHT = parseFloat(amount) || 0;
      const tva = amountHT * 0.2;
      const ttc = amountHT + tva;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Total HT :', pageWidth - 70, y);
      doc.text(`${amountHT.toFixed(2)} EUR`, pageWidth - 25, y, { align: 'right' });

      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('TVA (20%) :', pageWidth - 70, y);
      doc.text(`${tva.toFixed(2)} EUR`, pageWidth - 25, y, { align: 'right' });

      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Total TTC :', pageWidth - 70, y);
      doc.text(`${ttc.toFixed(2)} EUR`, pageWidth - 25, y, { align: 'right' });
    } else {
      // Particulier
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Total :', pageWidth - 70, y);
      doc.text(`${amount} EUR`, pageWidth - 25, y, { align: 'right' });

      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('TVA non applicable, art. 293 B du CGI', pageWidth - 25, y, { align: 'right' });
    }

    // --- Zone signature ---
    y += 25;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Signature :', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('(Signature et cachet)', 20, y + 6);
    doc.setDrawColor(180);
    doc.rect(20, y + 10, 70, 30);

    // --- Pied de page ---
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      'Ce document est un modèle de facture. Veuillez le compléter, le signer et le joindre à votre demande de retrait.',
      pageWidth / 2,
      280,
      { align: 'center' }
    );

    // Générer le PDF en buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="modele-facture-newbi-${type}-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Erreur génération PDF:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du modèle de facture' },
      { status: 500 }
    );
  }
}
