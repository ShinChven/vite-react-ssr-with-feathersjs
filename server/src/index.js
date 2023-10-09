import express from 'express';
import { renderHtml } from './ssr/server.js';
import fs from 'fs';
import path from 'path';
const app = express();

const isProd = process.env.NODE_ENV === 'production';

const template = fs.readFileSync(path.resolve('public/index.html'), 'utf-8');

// Route handler for the root path
app.get('*', async (req, res, next) => {
  const url = req.originalUrl;
  const appHtml = await renderHtml(url);
  if (appHtml === undefined) {
    return next();
  }
  const html = template.replace(`<!--app-html-->`, appHtml);
  res.send(html);
});

app.use(express.static('public'));

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
