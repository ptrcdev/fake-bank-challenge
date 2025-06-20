'use client';

import { graphqlClient } from '@/lib/graphqlClient';
import { gql } from 'graphql-request';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Transaction } from '@/components/transactions/TransactionHistory';

// ------------------
// GraphQL Definitions
// ------------------

const TRANSACTIONS_QUERY = gql`
  query GetTransactions($limit: Int!, $offset: Int!, $type: TransactionType) {
    myTransactions(limit: $limit, offset: $offset, type: $type) {
    total
    hasMore
    items {
      id
      type
      amount
      postBalance
      createdAt
    }
  }
  }
`;

const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
  login(input: {
    email: $email,
    password: $password
  }) {
    accessToken
    user {
      id
      email
      balance
    }
  }
}
`;

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!) {
  register(input: {
    email: $email,
    password: $password
  }) {
    accessToken
    user {
      id
      email
      balance
    }
  }
}
`;

const DEPOSIT_MUTATION = gql`
  mutation Deposit($amount: Float!) {
    deposit(amount: $amount) {
      id
      type
      amount
      postBalance
      createdAt
    }
  }
`;

const WITHDRAWAL_MUTATION = gql`
  mutation Withdraw($amount: Float!) {
    withdraw(amount: $amount) {
      id
      type
      amount
      postBalance
      createdAt
    }
  }
`;

const BALANCE_QUERY = gql`
  query GetBalance {
    getBalance
  }
`;

// ------------------
// Hooks
// ------------------

export const useLogin = () => {
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            graphqlClient().request(LOGIN_MUTATION, { email, password }),
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            graphqlClient().request(REGISTER_MUTATION, { email, password }),
    });
};

export const useDeposit = (token: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ amount }: { amount: number }) =>
            graphqlClient(token).request(DEPOSIT_MUTATION, { amount }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['balance'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
};

export const useWithdraw = (token: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ amount }: { amount: number }) =>
            graphqlClient(token).request(WITHDRAWAL_MUTATION, { amount }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['balance'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
};

export const useBalance = (token: string) => {
    return useQuery({
        queryKey: ['balance'],
        queryFn: async () => {
            const data = await graphqlClient(token).request(BALANCE_QUERY) as { getBalance: number };
            return data.getBalance;
        },
    });
};

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL';

export function useTransactions(limit: number, offset: number, token: string, type?: TransactionType) {
    const queryKey = type ? ['transactions', limit, offset, type] : ['transactions', limit, offset];
    return useQuery({
        queryKey,
        queryFn: async () => {
            const data = await graphqlClient(token).request(TRANSACTIONS_QUERY, {
                limit,
                offset,
                type,
            }) as { myTransactions: {
                total: number;
                hasMore: boolean;
                items: Transaction[];
            }};
            return data.myTransactions;
        },
    });
}