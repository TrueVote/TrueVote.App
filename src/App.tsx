import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { Loader, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { createClient } from 'graphql-ws';
import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EnvConfig } from './EnvConfig';
import { GlobalProvider } from './Global';
import { ROUTES } from './Routes';
import { getJwt } from './services/RESTDataClient';
import { AppLaunchModal } from './ui/AppLaunchModal';
import { TrueVoteSpinnerLoader } from './ui/CustomLoader';

export const App: FC = () => {
  const apiRoot: string | undefined = EnvConfig.apiRoot;
  console.info('ApiRoot', apiRoot);

  // Set up the HTTP link
  const httpLink: ApolloLink = createHttpLink({
    uri: apiRoot + `/api/graphql/`,
  });

  const wssLink: string =
    !apiRoot || apiRoot === '' || apiRoot === undefined // Probably running locally
      ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/graphql/`
      : `${apiRoot?.replace(/^https?/, 'wss')}/api/graphql/`;

  // get the authentication token from local storage if it exists
  const token: string | null = getJwt();

  // Set up the authentication link
  const authLink: ApolloLink = setContext((_: any, { headers }: any) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // Set up the WebSocket link
  const wsLink = new GraphQLWsLink(
    createClient({
      url: wssLink,
      connectionParams: () => ({
        authorization: token ? `Bearer ${token}` : '',
      }),
      on: {
        connected: () => console.warn('WebSocket connected'),
        error: (error: any) => console.error('WebSocket error:', error),
        closed: () => console.warn('WebSocket closed'),
      },
    }),
  );

  // Set up the split link
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
  );

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <GlobalProvider>
        <MantineProvider
          theme={{
            components: {
              Loader: Loader.extend({
                defaultProps: {
                  loaders: {
                    ...Loader.defaultLoaders,
                    TrueVoteSpinnerLoader: TrueVoteSpinnerLoader,
                  },
                  type: 'TrueVoteSpinnerLoader',
                },
              }),
            },
          }}
        >
          <AppLaunchModal />
          <BrowserRouter>{ROUTES}</BrowserRouter>
        </MantineProvider>
      </GlobalProvider>
    </ApolloProvider>
  );
};
