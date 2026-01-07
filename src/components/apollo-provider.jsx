'use client';

import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@/src/lib/apollo-client';

export function ApolloProviderWrapper({ children }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
