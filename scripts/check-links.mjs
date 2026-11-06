import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

// Inspect the built site, including fragments and local assets, without a server.
const root = path.resolve('dist');
const files = await fs.readdir(root, { recursive: true });
const pages = files.filter(file => file.endsWith('.html'));
assert(pages.length > 0, 'No HTML found. Run npm run build first.');
const html = new Map(await Promise.all(pages.map(async file => [path.resolve(root, file), await fs.readFile(path.join(root, file), 'utf8')])));
const ids = new Map([...html].map(([file, text]) => [file, new Set([...text.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]))]));
const failures = [];
let links = 0;
for (const [file, text] of html) {
  const route = '/' + path.relative(root, file).replaceAll(path.sep, '/').replace(/index\.html$/, '');
  const base = new URL(route, 'https://davidtempero.github.io');
  const h1s = [...text.matchAll(/<h1(?:\s|>)/g)];
  if (h1s.length !== 1) failures.push(`${route}: expected one h1, got ${h1s.length}`);
  if (!text.includes('id="main"')) failures.push(`${route}: missing skip-link target`);
  if (/\{%|\{\{/.test(text)) failures.push(`${route}: unrendered template syntax`);
  const title = text.match(/<title>([^<]+)<\/title>/)?.[1];
  if (!title) failures.push(`${route}: missing document title`);
  for (const match of text.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const reference = match[1].replaceAll('&amp;', '&');
    if (/^(?:mailto:|tel:|data:|javascript:)/i.test(reference)) continue;
    const url = new URL(reference, base);
    if (url.origin !== base.origin) continue;
    links++;
    const pathname = decodeURIComponent(url.pathname);
    const target = path.resolve(root, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
    if (!target.startsWith(root + path.sep)) { failures.push(`${route}: outside output ${reference}`); continue; }
    try { await fs.access(target); } catch { failures.push(`${route}: missing target ${reference}`); continue; }
    if (url.hash && !ids.get(target)?.has(decodeURIComponent(url.hash.slice(1)))) failures.push(`${route}: missing fragment ${reference}`);
  }
}
assert.equal(failures.length, 0, failures.join('\n'));
console.log(`Checked ${pages.length} pages and ${links} internal links/assets: all targets and fragments resolve.`);
