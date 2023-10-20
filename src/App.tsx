import { FC } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { Loader, MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { EnvConfig } from './EnvConfig';
import { ROUTES } from './Routes';
import { TrueVoteSpinnerLoader } from './ui/CustomLoader';
import '@mantine/core/styles.css';

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
      <MantineProvider
        theme={{
          components: {
            Loader: Loader.extend({
              defaultProps: {
                loaders: { ...Loader.defaultLoaders, TrueVoteSpinnerLoader: TrueVoteSpinnerLoader },
                type: 'TrueVoteSpinnerLoader',
              },
            }),
          },
        }}
      >
        <BrowserRouter>{ROUTES}</BrowserRouter>
      </MantineProvider>
    </ApolloProvider>
  );
};
