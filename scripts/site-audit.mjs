import { parse } from 'parse5';

export const siteOrigin = 'https://mppublicschool.online';
export const criticalRoutes = ['/', '/admissions', '/contact', '/fee-structure', '/disclosure', '/privacy-policy', '/terms', '/refund-policy'];
export const utilityRoutes = new Set(['/404', '/offline']);

export function attr(node, name) {
  return node.attrs?.find(attribute => attribute.name === name)?.value;
}

export function nodesIn(node) {
  return [node, ...(node.childNodes ?? []).flatMap(nodesIn)];
}

export function readableText(node) {
  if (['script', 'style', 'template'].includes(node.tagName) || attr(node, 'aria-hidden') === 'true' || attr(node, 'inert') !== undefined) return '';
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes ?? []).map(readableText).join(' ').replace(/\s+/g, ' ').trim();
}

// Validate the delivered HTML. Do not assume that a build or JavaScript hydration
// makes essential school information available to visitors and ad crawlers.
export function auditDocument(html, pathname) {
  const document = parse(html);
  const nodes = nodesIn(document);
  const issues = [];
  const find = (tagName, attribute, value) => nodes.find(node => node.tagName === tagName && (!attribute || attr(node, attribute) === value));
  const title = readableText(find('title') ?? {});
  if (!title.trim()) issues.push('Page title is missing.');
  if (!attr(find('meta', 'name', 'description') ?? {}, 'content')?.trim()) issues.push('Page description is missing.');
  if (!attr(find('meta', 'name', 'viewport') ?? {}, 'content')?.includes('width=device-width')) issues.push('Mobile viewport metadata is missing.');
  if (attr(find('link', 'rel', 'canonical') ?? {}, 'href') !== new URL(pathname, siteOrigin).href) issues.push('Canonical URL does not match the school domain and page.');
  if (nodes.filter(node => node.tagName === 'h1').length !== 1) issues.push('Page must contain one main heading.');
  const robots = attr(find('meta', 'name', 'robots') ?? {}, 'content') ?? '';
  if (utilityRoutes.has(pathname) ? !robots.includes('noindex') : robots.includes('noindex')) issues.push('Page indexing setting is incorrect.');
  if (!find('a', 'href', '/privacy-policy')) issues.push('Privacy Policy link is missing.');
  if (!find('a', 'href', '/contact')) issues.push('School contact link is missing.');
  if (!find('link', 'rel', 'manifest')) issues.push('PWA manifest link is missing.');

  const ids = new Set();
  for (const node of nodes) {
    const id = attr(node, 'id');
    if (id) {
      if (ids.has(id)) issues.push(`Duplicate element ID: ${id}`);
      ids.add(id);
    }
    if (node.tagName === 'img' && attr(node, 'alt') === undefined) issues.push(`Image has no alt attribute: ${attr(node, 'src')}`);
    if (node.tagName === 'iframe' && !attr(node, 'title')) issues.push('Embedded content has no accessible title.');
    if (node.tagName === 'form') {
      const action = attr(node, 'action');
      try {
        const endpoint = new URL(action);
        if (endpoint.protocol !== 'https:' || endpoint.hostname !== 'docs.google.com' || !endpoint.pathname.endsWith('/formResponse')) issues.push('Enquiry form does not use the configured HTTPS submission service.');
      } catch {
        issues.push('Enquiry form has no usable submission endpoint.');
      }
      if (attr(node, 'method')?.toLowerCase() !== 'post') issues.push('Enquiry form must submit using POST.');
      if (attr(node, 'novalidate') !== undefined) issues.push('Native enquiry validation is disabled.');
      const children = nodesIn(node);
      if (!children.some(child => child.tagName === 'input' && attr(child, 'type') === 'checkbox' && attr(child, 'required') !== undefined)) issues.push('Enquiry form privacy acknowledgement is missing.');
      if (!children.some(child => child.tagName === 'a' && attr(child, 'href') === '/privacy-policy')) issues.push('Enquiry form has no nearby privacy link.');
    }
  }

  const schemas = [];
  for (const node of nodes.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json')) {
    try { schemas.push(JSON.parse((node.childNodes ?? []).map(child => child.value ?? '').join(''))); }
    catch { issues.push('Structured data contains invalid JSON.'); }
  }
  const school = schemas.find(schema => [schema['@type']].flat().includes('School'));
  if (!school) issues.push('School identity structured data is missing.');
  else {
    if (school.url !== siteOrigin || school.hasCredential?.identifier !== '532414' || school.hasCredential?.recognizedBy?.name !== 'MP Board') issues.push('School identity or affiliation differs from the supplied school record.');
    if (!school.telephone || !school.email || !school.address?.streetAddress) issues.push('School contact information is incomplete.');
  }
  const text = readableText(find('body') ?? document);
  for (const pattern of [/CBSE-affiliated/i, /affiliated with CBSE/i, /premier CBSE/i, /98%\s+(?:board\s+)?pass rate/i, /ISO 9001:2015 certified/i]) {
    if (pattern.test(text)) issues.push(`Unsupported claim remains in page text: ${pattern}`);
  }
  if (!/MP Board/i.test(text) || !text.includes('532414')) issues.push('Document-backed board and affiliation number are absent from visible school information.');
  if (['/admissions', '/contact'].includes(pathname) && !find('form')) issues.push('Enquiry form is absent from the delivered page.');
  return { issues, nodes, ids, title };
}

export function isSchoolHost(url) {
  return [new URL(siteOrigin).hostname, `www.${new URL(siteOrigin).hostname}`].includes(url.hostname);
}
