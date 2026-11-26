import sitemap from '../../public/semantic-sitemap.json';

// The screen a page declares (data-agentom-screen), named from its route template in the
// semantic sitemap (scripts/build-semantic-sitemap.js): its fixed segments joined by dots, and
// "detail" for a page that ends with a record's id: /websites/{websiteId}/events is
// "websites.events", /admin/users/{userId} is "admin.users.detail", / is "home".

interface SitemapNode {
  path: string;
  children?: SitemapNode[];
}

function match(
  node: SitemapNode,
  segments: string[],
  template: string[],
  score: number[],
): { template: string[]; score: number[] } | null {
  if (!segments.length) {
    return { template, score };
  }

  let best: { template: string[]; score: number[] } | null = null;

  for (const child of node.children ?? []) {
    const parts = child.path.split('/');
    const childScore: number[] = [];
    let used = 0;
    let ok = true;

    for (const part of parts) {
      if (part === '*') {
        childScore.push(0);
        used = segments.length;
        break;
      }
      if (used >= segments.length) {
        ok = false;
        break;
      }
      if (part.startsWith('{')) {
        childScore.push(1);
      } else if (part === segments[used]) {
        childScore.push(2);
      } else {
        ok = false;
        break;
      }
      used++;
    }

    if (!ok) {
      continue;
    }

    const result = match(
      child,
      segments.slice(used),
      [...template, ...parts],
      [...score, ...childScore],
    );

    if (result && (!best || compare(result.score, best.score) > 0)) {
      best = result;
    }
  }

  return best;
}

function compare(a: number[], b: number[]) {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      return a[i] - b[i];
    }
  }
  return a.length - b.length;
}

export function getScreenName(pathname: string) {
  const segments = (pathname || '/')
    .split('/')
    .filter(Boolean)
    .map(segment => decodeURIComponent(segment));
  const result = match(sitemap as SitemapNode, segments, [], []);

  if (!result) {
    return undefined;
  }

  const { template } = result;

  if (!template.length) {
    return 'home';
  }

  const names = template.filter(part => !part.startsWith('{') && part !== '*');
  const last = template[template.length - 1];

  if (last.startsWith('{')) {
    names.push('detail');
  }

  return names.join('.') || 'home';
}
