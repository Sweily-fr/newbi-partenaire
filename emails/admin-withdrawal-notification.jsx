import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export const AdminWithdrawalNotification = ({
  partnerName = 'Partenaire',
  partnerEmail = 'partner@example.com',
  partnerId = 'P-000000',
  amount = 0,
  requestDate = new Date().toLocaleDateString('fr-FR'),
  withdrawalId = 'WD-000000',
  bankDetails = {
    iban: '****',
    bic: '****',
    accountHolder: '****',
  },
  availableBalance = 0,
  totalEarnings = 0,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Nouvelle demande de retrait - {partnerName}</Preview>
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
            <Heading style={h1}>Nouvelle demande de retrait</Heading>
            
            <Text style={text}>
              Une nouvelle demande de retrait de <strong>{amount.toFixed(2)}€</strong> a été effectuée par {partnerName}.
            </Text>

            <Section style={detailsBox}>
              <Text style={detailsTitle}>Informations du partenaire</Text>
              <table style={detailsTable}>
                <tr>
                  <td style={detailsLabel}>Nom</td>
                  <td style={detailsValue}>{partnerName}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Email</td>
                  <td style={detailsValue}>{partnerEmail}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>ID Partenaire</td>
                  <td style={detailsValue}>{partnerId}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Solde disponible</td>
                  <td style={detailsValue}>{availableBalance.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Gains totaux</td>
                  <td style={detailsValue}>{totalEarnings.toFixed(2)}€</td>
                </tr>
              </table>
            </Section>

            <Section style={detailsBox}>
              <Text style={detailsTitle}>Détails du retrait</Text>
              <table style={detailsTable}>
                <tr>
                  <td style={detailsLabel}>Numéro de demande</td>
                  <td style={detailsValue}>{withdrawalId}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Montant</td>
                  <td style={amountValue}>{amount.toFixed(2)}€</td>
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
              Veuillez traiter cette demande dans les 7 jours ouvrés.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Cet email a été envoyé automatiquement par le système Newbi Partner.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminWithdrawalNotification;

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

const amountValue = {
  color: '#5b50ff',
  fontSize: '16px',
  fontWeight: '600',
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
  margin: '16px 0',
};
