/* eslint-disable @typescript-eslint/no-explicit-any */
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mantine/core',
      '@mantine/hooks',
      '@hello-pangea/dnd',
      '@mantine/notifications',
      '@tabler/icons-react',
    ],
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  plugins: [react(), basicSsl()],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
  },
  define: {
    __API_URL__: JSON.stringify(mode === 'production' ? 'https://api.truevote.org/api' : '/api'),
  },
  server: {
    hmr: {
      overlay: false, // Disable the error overlay
    },
    fs: {
      strict: false, // Allows importing from outside the root
    },
    proxy: {
      '/api': {
        target: 'https://localhost:7253',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy: any, _options: any): void => {
          proxy.on('error', (err: any, _req: any, _res: any) => {
            console.info('Proxy Error', err);
          });
          proxy.on('proxyReq', (_proxyReq: any, req: any, _res: any) => {
            console.info('Proxy Send:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
            console.info('Proxy Receive:', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
}));
