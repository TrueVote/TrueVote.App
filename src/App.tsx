import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Loader, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EnvConfig } from './EnvConfig';
import { GlobalProvider } from './Global';
import { ROUTES } from './Routes';
import { getJwt } from './services/DataClient';
import { TrueVoteSpinnerLoader } from './ui/CustomLoader';

export const App: FC = () => {
  const apiRoot: string | undefined = EnvConfig.apiRoot;
  console.info('ApiRoot', apiRoot);

  const httpLink: ApolloLink = createHttpLink({
    uri: apiRoot + `/api/graphql/`,
  });

  const authLink: ApolloLink = setContext((_: any, { headers }: any) => {
    // get the authentication token from local storage if it exists
    const token: any = getJwt();

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    link: authLink.concat(httpLink),
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
          <BrowserRouter>{ROUTES}</BrowserRouter>
        </MantineProvider>
      </GlobalProvider>
    </ApolloProvider>
  );
};
