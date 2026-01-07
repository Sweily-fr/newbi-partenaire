/**
 * Vérifie si un email appartient à un administrateur
 * @param {string} email - L'email à vérifier
 * @returns {boolean} - True si l'email est admin
 */
export function isAdminEmail(email) {
  if (!email) return false;
  const adminDomains = ['@sweily.fr', '@newbi.fr'];
  return adminDomains.some(domain => email.toLowerCase().endsWith(domain));
}

/**
 * Vérifie si l'utilisateur connecté est un administrateur
 * @param {object} user - L'objet utilisateur de la session
 * @returns {boolean} - True si l'utilisateur est admin
 */
export function isAdmin(user) {
  if (!user || !user.email) return false;
  return isAdminEmail(user.email);
}
