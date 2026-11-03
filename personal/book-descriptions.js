const {canonicalTitle}=require('./book-identity');
const synopses = require('./book-synopses.json');
const bookInfo = require('./book-info.json');
const normalize = s => String(s || '').normalize('NFKC').toLowerCase().replace(/ё/g, 'е').replace(/[^а-яa-z0-9]/g, '');
const authorWords = s => String(s || '').normalize('NFKC').toLowerCase().replace(/ё/g, 'е').split(/[^а-яa-z0-9]+/).filter(Boolean);
function authorMatches(requested, actual) {
  const words = authorWords(requested), available = authorWords(actual);
  return !words.length || (available.length > 0 && words.every(w => available.some(a => w.length === 1 ? a.startsWith(w) : a === w)));
}
function selectBundledDescription(title, author = '') {
  const key = normalize(canonicalTitle(title)), record = synopses[key];
  if (!record || !record.description) return null;
  const knownAuthor = record.author || bookInfo[key]?.author || '';
  if (!authorMatches(author, knownAuthor)) return null;
  return {...record, author: knownAuthor};
}
function selectDescription(items, title, author = '') {
  const key = normalize(canonicalTitle(title));
  for (const item of items || []) {
    const v = item.volumeInfo || {};
    if (normalize(canonicalTitle(v.title)) !== key || !v.description || (author && !(v.authors || []).some(a => authorMatches(author, a)))) continue;
    return {description: String(v.description).replace(/<[^>]*>/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim().slice(0, 2500), source: v.infoLink || 'https://books.google.com/', author: (v.authors || []).join(', ')};
  }
  return null;
}
function createDescriptionLookup(fetchImpl = fetch) {
  const cache = new Map();
  return async function lookup(title, author = '') {
    if (!normalize(title)) return null;
    const bundled = selectBundledDescription(title, author);
    if (bundled) return bundled;
    const key = normalize(title) + '|' + normalize(author);
    if (cache.has(key)) return cache.get(key);
    const job = (async () => {
      const url = new URL('https://www.googleapis.com/books/v1/volumes');
      url.searchParams.set('q', canonicalTitle(title).slice(0, 180) + ' ' + String(author).slice(0, 120));
      url.searchParams.set('langRestrict', 'ru');
      url.searchParams.set('maxResults', '10');
      url.searchParams.set('fields', 'items(volumeInfo(title,authors,description,infoLink))');
      const r = await fetchImpl(url, {signal: AbortSignal.timeout(12000)});
      if (!r.ok) throw Error(r.status===429?'Сервис поиска аннотаций временно ограничил запросы. Повторите позже.':'Сервис поиска аннотаций временно недоступен. Повторите позже.');
      return selectDescription((await r.json()).items, title, author);
    })();
    cache.set(key, job);
    try { return await job; } catch (e) { cache.delete(key); throw e; }
  };
}
module.exports = {normalize, authorMatches, selectDescription, selectBundledDescription, createDescriptionLookup};
