import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

function playwrightApiPlugin() {
  return {
    name: 'playwright-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/run-playwright' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const mode = parsed.mode || 'buggy';
              // Dynamically import the execution runner
              // @ts-expect-error CJS script module
              const { runRealPlaywrightTest } = await import('./scripts/run-playwright-exec.cjs');
              const result = await runRealPlaywrightTest(mode, 'http://127.0.0.1:3000');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), playwrightApiPlugin()],
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
})
