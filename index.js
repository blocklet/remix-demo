import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.PORT || '3001', 10);

const viteDevServer =
  isProduction
    ? null
    : await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const app = express();
app.use(viteDevServer ? viteDevServer.middlewares : express.static('build/client'));

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
  : await import(path.join(process.cwd(), 'build/server/index.js'));

app.all('*', createRequestHandler({ build }));

app.listen(port, () => {
  console.log(`remix blocklet ready on http://127.0.0.1:${port}`);
});
