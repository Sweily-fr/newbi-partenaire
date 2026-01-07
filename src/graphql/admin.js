import { gql } from '@apollo/client';

export const GET_ALL_WITHDRAWALS = gql`
  query GetAllWithdrawals($status: String) {
    getAllWithdrawals(status: $status) {
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
      partner {
        id
        name
        email
        totalEarnings
        availableBalance
      }
    }
  }
`;

export const APPROVE_WITHDRAWAL = gql`
  mutation ApproveWithdrawal($withdrawalId: ID!) {
    approveWithdrawal(withdrawalId: $withdrawalId) {
      success
      message
      withdrawal {
        id
        status
        processedAt
      }
    }
  }
`;

export const REJECT_WITHDRAWAL = gql`
  mutation RejectWithdrawal($withdrawalId: ID!, $reason: String) {
    rejectWithdrawal(withdrawalId: $withdrawalId, reason: $reason) {
      success
      message
      withdrawal {
        id
        status
        processedAt
      }
    }
  }
`;
