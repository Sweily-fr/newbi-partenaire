import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envoie un email de vérification
 */
export async function sendVerificationEmail(user, url) {
  console.log(`📧 Envoi email de vérification à ${user.email}`);
  console.log(`🔗 URL de vérification: ${url}`);

  await resend.emails.send({
    to: user.email,
    subject: "Vérifiez votre adresse e-mail - Newbi Partner",
    html: emailVerificationTemplate(url, user.name),
    from: "Newbi Partner <noreply@newbi.sweily.fr>",
  });

  console.log(`✅ Email de vérification envoyé à ${user.email}`);
}

/**
 * Envoie un email de réinitialisation de mot de passe
 */
export async function sendResetPasswordEmail(user, url) {
  console.log(`📧 Envoi email de réinitialisation à ${user.email}`);

  await resend.emails.send({
    to: user.email,
    subject: "Réinitialisez votre mot de passe - Newbi Partner",
    html: resetPasswordTemplate(url, user.name),
    from: "Newbi Partner <noreply@newbi.sweily.fr>",
  });

  console.log(`✅ Email de réinitialisation envoyé à ${user.email}`);
}

/**
 * Template pour la vérification d'email
 */
function emailVerificationTemplate(url, userName) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vérifiez votre adresse e-mail</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #5a50ff; font-size: 28px; font-weight: 600;">Newbi Partner</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 20px 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                    Vérifiez votre adresse e-mail
                  </h2>
                  
                  ${userName ? `<p style="margin: 0 0 16px 0; color: #4a4a4a; font-size: 16px; line-height: 1.5;">Bonjour ${userName},</p>` : ''}
                  
                  <p style="margin: 0 0 16px 0; color: #4a4a4a; font-size: 16px; line-height: 1.5;">
                    Bienvenue dans le programme partenaire Newbi ! Pour finaliser votre inscription, veuillez vérifier votre adresse e-mail en cliquant sur le bouton ci-dessous :
                  </p>
                  
                  <!-- Button -->
                  <table role="presentation" style="margin: 32px 0; width: 100%;">
                    <tr>
                      <td align="center">
                        <a href="${url}" style="display: inline-block; padding: 14px 32px; background-color: #5a50ff; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                          Vérifier mon adresse e-mail
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 24px 0 0 0; color: #6a6a6a; font-size: 14px; line-height: 1.5;">
                    Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                  </p>
                  <p style="margin: 8px 0 0 0; color: #5a50ff; font-size: 14px; word-break: break-all;">
                    ${url}
                  </p>
                  
                  <p style="margin: 24px 0 0 0; color: #6a6a6a; font-size: 14px; line-height: 1.5;">
                    Ce lien expirera dans 1 heure.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 32px 40px; border-top: 1px solid #e5e5e5;">
                  <p style="margin: 0; color: #8a8a8a; font-size: 12px; line-height: 1.5;">
                    Si vous n'avez pas créé de compte partenaire Newbi, vous pouvez ignorer cet e-mail en toute sécurité.
                  </p>
                  <p style="margin: 16px 0 0 0; color: #8a8a8a; font-size: 12px;">
                    © ${new Date().getFullYear()} Newbi. Tous droits réservés.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Template pour la réinitialisation de mot de passe
 */
function resetPasswordTemplate(url, userName) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réinitialisez votre mot de passe</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #5a50ff; font-size: 28px; font-weight: 600;">Newbi Partner</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 20px 40px;">
                  <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                    Réinitialisez votre mot de passe
                  </h2>
                  
                  ${userName ? `<p style="margin: 0 0 16px 0; color: #4a4a4a; font-size: 16px; line-height: 1.5;">Bonjour ${userName},</p>` : ''}
                  
                  <p style="margin: 0 0 16px 0; color: #4a4a4a; font-size: 16px; line-height: 1.5;">
                    Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                  </p>
                  
                  <!-- Button -->
                  <table role="presentation" style="margin: 32px 0; width: 100%;">
                    <tr>
                      <td align="center">
                        <a href="${url}" style="display: inline-block; padding: 14px 32px; background-color: #5a50ff; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                          Réinitialiser mon mot de passe
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 24px 0 0 0; color: #6a6a6a; font-size: 14px; line-height: 1.5;">
                    Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                  </p>
                  <p style="margin: 8px 0 0 0; color: #5a50ff; font-size: 14px; word-break: break-all;">
                    ${url}
                  </p>
                  
                  <p style="margin: 24px 0 0 0; color: #6a6a6a; font-size: 14px; line-height: 1.5;">
                    Ce lien expirera dans 1 heure.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 32px 40px; border-top: 1px solid #e5e5e5;">
                  <p style="margin: 0; color: #8a8a8a; font-size: 12px; line-height: 1.5;">
                    Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet e-mail en toute sécurité. Votre mot de passe ne sera pas modifié.
                  </p>
                  <p style="margin: 16px 0 0 0; color: #8a8a8a; font-size: 12px;">
                    © ${new Date().getFullYear()} Newbi. Tous droits réservés.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
