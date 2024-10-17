import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  plugins: [react(), basicSsl(), EnvironmentPlugin({ API_ROOT: '' })],
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'https://localhost:7253',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.info('Proxy Error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.info('Proxy Send:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.info('Proxy Receive:', proxyRes.statusCode, req.url);
          });
          proxy.on('upgrade', (req, socket, head) => {
            console.info('WebSocket Upgrade:', req.url);
          });
        },
      },
    },
  },
});
