
import type { Plugin } from 'vite';

/**
 * A smarter HMR plugin for Vite.
 * It triggers a full page reload only when specific configuration files are changed.
 * This provides a balance between development experience and stability.
 *
 * - For changes in `src/settings/**` or `.env.*` files, it forces a full reload.
 * - For all other files, it lets Vite handle HMR normally (fast, partial updates).
 */
export default function hmrPlugin(): Plugin {
  return {
    name: 'vite-plugin-smart-hmr',
    handleHotUpdate({ file, server }) {
      // Check if the changed file is a project setting or an environment file.
      if (file.includes('src/settings/') || file.match(/\.env\.[a-zA-Z]+$/)) {
        console.log(`[Smart HMR] Configuration file changed: ${file}. Reloading page...`);
        // Send a command to the client to perform a full reload.
        server.ws.send({
          type: 'full-reload',
          path: '*',
        });
        // Return an empty array to prevent Vite from processing the update further.
        return [];
      }
    },
  };
}