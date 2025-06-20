import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/graphql';

export const graphqlClient = (token?: string) => new GraphQLClient(endpoint, {
    headers: {
        "Authorization": "Bearer " + token,
    }
});
