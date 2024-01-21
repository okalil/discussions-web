import path from 'path';
import { routeExtensions } from 'remix-custom-routes';
import { installGlobals } from '@remix-run/node';
import { unstable_vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

installGlobals();

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    remix({
      ignoredRouteFiles: ['**/.*'],
      serverModuleFormat: 'cjs',
      async routes() {
        const appDirectory = path.join(__dirname, 'app');
        return routeExtensions(appDirectory);
      },
    }),
    tsconfigPaths(),
  ],
});
