import { ApolloClient, ApolloProvider, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { Loader, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EnvConfig } from './EnvConfig';
import { GlobalProvider } from './Global';
import { ROUTES } from './Routes';
import { TrueVoteSpinnerLoader } from './ui/CustomLoader';

export const App: FC = () => {
  const apiRoot: string | undefined = EnvConfig.apiRoot;
  console.info('ApiRoot', apiRoot);

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    uri: apiRoot + `/api/graphql/`,
    credentials: 'include',
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
