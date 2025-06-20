import { gql } from 'graphql-request';

export const GET_TRANSACTIONS = gql`
  query GetTransactions($limit: Int, $offset: Int) {
    getUserTransactionsPaginated(limit: $limit, offset: $offset) {
      items {
        id
        type
        amount
        postBalance
        createdAt
      }
      total
      hasMore
    }
  }
`;
