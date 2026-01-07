import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export const PartnerWithdrawalConfirmation = ({
  partnerName = 'Partenaire',
  amount = 0,
  requestDate = new Date().toLocaleDateString('fr-FR'),
  withdrawalId = 'WD-000000',
  bankDetails = {
    iban: '****',
    bic: '****',
    accountHolder: '****',
  },
}) => {
  return (
    <Html>
      <Head />
      <Preview>Confirmation de votre demande de retrait - Newbi Partner</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://pub-866a54f5560d449cb224411e60410621.r2.dev/Logo_Texte_Black.png"
              width="120"
              height="40"
              alt="Newbi"
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Heading style={h1}>Demande de retrait confirmée</Heading>
            
            <Text style={text}>
              Bonjour {partnerName},
            </Text>

            <Text style={text}>
              Nous avons bien reçu votre demande de retrait de <strong>{amount.toFixed(2)}€</strong>.
            </Text>

            <Section style={detailsBox}>
              <Text style={detailsTitle}>Détails de la demande</Text>
              <table style={detailsTable}>
                <tr>
                  <td style={detailsLabel}>Numéro de demande</td>
                  <td style={detailsValue}>{withdrawalId}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Montant</td>
                  <td style={detailsValue}>{amount.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Date</td>
                  <td style={detailsValue}>{requestDate}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Méthode</td>
                  <td style={detailsValue}>Virement bancaire</td>
                </tr>
              </table>
            </Section>

            <Section style={detailsBox}>
              <Text style={detailsTitle}>Coordonnées bancaires</Text>
              <table style={detailsTable}>
                <tr>
                  <td style={detailsLabel}>Titulaire</td>
                  <td style={detailsValue}>{bankDetails.accountHolder}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>IBAN</td>
                  <td style={detailsValue}>{bankDetails.iban}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>BIC</td>
                  <td style={detailsValue}>{bankDetails.bic}</td>
                </tr>
              </table>
            </Section>

            <Text style={text}>
              Votre demande sera traitée sous 7 jours ouvrés. Vous recevrez une notification par email une fois le virement effectué.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Si vous avez des questions, contactez-nous à{' '}
              <Link href="mailto:contact@newbi.fr" style={link}>
                contact@newbi.fr
              </Link>
            </Text>

            <Text style={footerCopyright}>
              © 2025 Newbi Partner. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PartnerWithdrawalConfirmation;

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const header = {
  padding: '32px 0',
  textAlign: 'center',
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '0 40px',
};

const h1 = {
  color: '#000000',
  fontSize: '24px',
  fontWeight: '600',
  margin: '30px 0 20px',
  padding: '0',
  lineHeight: '1.3',
};

const text = {
  color: '#000000',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
};

const detailsBox = {
  margin: '32px 0',
};

const detailsTitle = {
  color: '#000000',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const detailsTable = {
  width: '100%',
  borderCollapse: 'collapse',
};

const detailsLabel = {
  color: '#666666',
  fontSize: '14px',
  padding: '8px 0',
  width: '40%',
  verticalAlign: 'top',
};

const detailsValue = {
  color: '#000000',
  fontSize: '14px',
  padding: '8px 0',
  verticalAlign: 'top',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center',
  margin: '16px 0 8px',
};

const footerCopyright = {
  color: '#999999',
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center',
  margin: '8px 0',
};

const link = {
  color: '#5b50ff',
  textDecoration: 'none',
};
