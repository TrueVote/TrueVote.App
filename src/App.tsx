import { ApolloClient, ApolloProvider, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  MantineThemeOverride,
} from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EnvConfig } from './EnvConfig';
import { ROUTES } from './Routes';

export const App: FC = () => {
  const apiRoot: string | undefined = EnvConfig.apiRoot;
  console.info('ApiRoot', apiRoot);

  const defaultColorScheme: ColorScheme = useColorScheme();

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'color-scheme',
    defaultValue: defaultColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme: any = (value?: ColorScheme) => {
    const val: ColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(val);
  };

  const theme: MantineThemeOverride = {
    colorScheme: colorScheme,
    primaryColor: 'blue',
    defaultRadius: 0,
  };

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    uri: apiRoot + `/api/graphql/`,
    credentials: 'include',
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
          <BrowserRouter>{ROUTES}</BrowserRouter>
        </MantineProvider>
      </ColorSchemeProvider>
    </ApolloProvider>
  );
};
