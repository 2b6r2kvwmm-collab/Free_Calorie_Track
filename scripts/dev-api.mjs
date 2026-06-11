// Local dev server for the Vercel functions in /api — lets the Vite dev server
// proxy /api/* requests so AI features can be tested without deploying.
// Usage: node scripts/dev-api.mjs  (reads GEMINI_API_KEY from calorie-tracker/.env)
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// Minimal .env loader (no dependency)
try {
  const env = readFileSync(path.join(root, 'calorie-tracker', '.env'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
} catch { /* no .env */ }

if (!process.env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY not set — add it to calorie-tracker/.env');
}

const routes = {
  '/api/analyze-food': (await import(path.join(root, 'api', 'analyze-food.js'))).default,
  '/api/coach': (await import(path.join(root, 'api', 'coach.js'))).default,
};

const PORT = 3001;

http.createServer(async (req, res) => {
  const handler = routes[req.url.split('?')[0]];
  if (!handler) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end('{"error":"Not found"}');
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  try {
    req.body = raw ? JSON.parse(raw) : {};
  } catch {
    req.body = {};
  }

  // Vercel-style res shim
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); return res; };

  try {
    await handler(req, res);
  } catch (err) {
    console.error('Handler error:', err);
    if (!res.writableEnded) res.status(500).json({ error: 'Internal error' });
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Dev API listening on http://127.0.0.1:${PORT} (routes: ${Object.keys(routes).join(', ')})`);
});
