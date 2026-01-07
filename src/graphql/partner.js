import { gql } from '@apollo/client';

/**
 * Query pour récupérer toutes les statistiques du partenaire
 */
export const GET_PARTNER_STATS = gql`
  query GetPartnerStats {
    getPartnerStats {
      totalEarnings
      availableBalance
      totalRevenue
      activeReferrals
      totalReferrals
      commissionRate
      currentTier
      nextTier
      progressToNextTier
      earningsHistory {
        month
        year
        earnings
      }
      revenueHistory {
        month
        year
        revenue
      }
      withdrawals {
        id
        amount
        status
        requestedAt
        processedAt
        method
        bankDetails {
          iban
          bic
          accountHolder
        }
      }
    }
  }
`;

/**
 * Query pour récupérer les paliers de commission
 */
export const GET_COMMISSION_TIERS = gql`
  query GetCommissionTiers {
    getCommissionTiers {
      name
      percentage
      minRevenue
      maxRevenue
    }
  }
`;

/**
 * Query pour récupérer l'historique des retraits
 */
export const GET_WITHDRAWALS = gql`
  query GetWithdrawals {
    getWithdrawals {
      id
      amount
      status
      requestedAt
      processedAt
      method
      bankDetails {
        iban
        bic
        accountHolder
      }
    }
  }
`;

/**
 * Mutation pour demander un retrait
 */
export const REQUEST_WITHDRAWAL = gql`
  mutation RequestWithdrawal($amount: Float!, $method: String!) {
    requestWithdrawal(amount: $amount, method: $method) {
      success
      message
      withdrawal {
        id
        amount
        status
        requestedAt
        processedAt
        method
      }
    }
  }
`;

/**
 * Query pour récupérer la liste détaillée des filleuls avec leurs commissions
 */
export const GET_PARTNER_REFERRALS = gql`
  query GetPartnerReferrals {
    getPartnerReferrals {
      id
      name
      email
      company
      subscriptionType
      subscriptionPrice
      status
      registrationDate
      totalRevenue
      commission
    }
  }
`;
