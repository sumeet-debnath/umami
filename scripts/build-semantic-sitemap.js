/* eslint-disable no-console */
// Writes public/semantic-sitemap.json, the app's pages as a tree of path templates (the Agent
// Object Model's semantic sitemap: a root node "/" with relative child paths, `{param}` for a
// dynamic segment and `*` for a catch-all). Generated from the page.tsx files under src/app; run
// before `next build` and `next dev`, never edited by hand.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = join(__dirname, '..', 'src', 'app');
const outputPath = join(__dirname, '..', 'public', 'semantic-sitemap.json');

// next.config.ts serves the signed-in pages under /teams/{teamId} too (the rewrite
// `/teams/:teamId/:path*` → `/:path*`). The navigation links there to a team's boards, websites,
// links, pixels and settings; the dashboard redirects out of a team, and admin, the teams list and
// the console are linked only outside one.
const TEAM_SCOPE = 'teams/{teamId}';
const TEAM_EXCLUDED = new Set(['dashboard', 'admin', 'teams', 'console']);

function segmentOf(folder) {
  if (/^\(.*\)$/.test(folder)) {
    return null; // a route group: no segment of its own
  }
  const catchAll = folder.match(/^\[\[?\.\.\.(\w+)\]\]?$/);
  if (catchAll) {
    return { segment: '*', optional: folder.startsWith('[[') };
  }
  const param = folder.match(/^\[(\w+)\]$/);
  if (param) {
    return { segment: `{${param[1]}}` };
  }
  return { segment: folder };
}

function titleOf(pageFile) {
  const source = readFileSync(pageFile, 'utf8');
  const match = source.match(/metadata[^=]*=\s*\{[^}]*?title:\s*'([^']+)'/s);
  return match?.[1];
}

function nameFor(segment, title) {
  if (!title) {
    return undefined;
  }
  if (segment.startsWith('{') || segment === '*') {
    return title;
  }
  const words = segment.replace(/-/g, ' ').toLowerCase();
  return title.toLowerCase() === words ? undefined : title;
}

// Collects every page as a list of segments, with its title.
function collect(dir, segments, pages) {
  const entries = readdirSync(dir, { withFileTypes: true });

  if (entries.some(entry => entry.isFile() && entry.name === 'page.tsx')) {
    pages.push({ segments, title: titleOf(join(dir, 'page.tsx')) });
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    // Parallel routes (@modal) and intercepting routes ((.)…) show a page that has its own
    // address elsewhere; API routes and private folders have no pages.
    if (entry.name.startsWith('@') || entry.name.startsWith('_') || entry.name === 'api') {
      continue;
    }
    if (/^\(\.+\)/.test(entry.name)) {
      continue;
    }
    const part = segmentOf(entry.name);
    const child = join(dir, entry.name);

    if (!part) {
      collect(child, segments, pages);
    } else if (part.segment === '*') {
      if (part.optional) {
        collect(child, segments, pages);
      }
      collect(child, [...segments, '*'], pages);
    } else {
      collect(child, [...segments, part.segment], pages);
    }
  }

  return pages;
}

function buildTree(pages) {
  const root = { path: '/', children: new Map(), isPage: false };

  for (const { segments, title } of pages) {
    let node = root;
    for (const segment of segments) {
      if (!node.children.has(segment)) {
        node.children.set(segment, { segment, children: new Map(), isPage: false });
      }
      node = node.children.get(segment);
    }
    node.isPage = true;
    node.name = segments.length ? nameFor(segments[segments.length - 1], title) : title;
  }

  // A segment with no page of its own folds into its children ("a/b" under the parent).
  const toNode = (node, prefix = '') => {
    const path = prefix ? `${prefix}/${node.segment}` : node.segment;
    const children = [...node.children.values()].sort((a, b) => a.segment.localeCompare(b.segment));

    if (!node.isPage) {
      return children.flatMap(child => toNode(child, path));
    }

    const out = { path };
    if (node.name) {
      out.name = node.name;
    }
    const kids = children.flatMap(child => toNode(child));
    if (kids.length) {
      out.children = kids;
    }
    return [out];
  };

  const rootNode = { path: '/' };
  if (root.isPage && root.name) {
    rootNode.name = root.name;
  }
  const children = [...root.children.values()]
    .sort((a, b) => a.segment.localeCompare(b.segment))
    .flatMap(child => toNode(child));
  if (children.length) {
    rootNode.children = children;
  }
  return rootNode;
}

const allPages = collect(appDir, [], []);
const mainDir = join(appDir, '(main)');
const mainPages = existsSync(mainDir) ? collect(mainDir, [], []) : [];
const teamPages = mainPages
  .filter(
    ({ segments }) =>
      segments.length && !TEAM_EXCLUDED.has(segments[0]) && !segments.includes('{teamId}'),
  )
  .map(({ segments, title }) => ({ segments: [...TEAM_SCOPE.split('/'), ...segments], title }));

const sitemap = buildTree([...allPages, ...teamPages]);
const json = `${JSON.stringify(sitemap, null, 2)}\n`;

if (!existsSync(outputPath) || readFileSync(outputPath, 'utf8') !== json) {
  writeFileSync(outputPath, json);
  console.log(`Wrote ${outputPath}`);
}
