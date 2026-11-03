const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const icons = require('../category-icons');

// These fixtures catch lost semantic branches and precedence regressions.
test('Russian category names select meaningful line icons despite numeric prefixes', () => {
  for (const [name, expected] of [
    ['02. Адептус Механикус', 'cog'], ['02. Велизарий Коул', 'cpu'],
    ['Кузницы Марса', 'cog'], ['Инквизиция', 'eye'], ['Эйзенхорн', 'eye'],
    ['Хаос', 'flame'], ['Повелители ночи', 'flame'], ['Ересь Хоруса', 'swords'],
    ['Имперская гвардия', 'shield'], ['Кайафас Каин', 'shield'],
    ['Космодесант', 'sword'], ['Астартес', 'sword'], ['Ксеносы', 'orbit'],
    ['Империум', 'crown'], ['Рассказы', 'library-big'], ['Галактика ужасов', 'skull'],
  ]) assert.equal(icons.iconName(name), expected, name);
});

test('the closest recognized category wins and unknown children inherit their parent', () => {
  assert.equal(icons.iconName('Книги/02. Адептус Механикус/02. Велизарий Коул/'), 'cpu');
  assert.equal(icons.iconName('Книги\\02. Адептус Механикус\\01. Неизвестная серия'), 'cog');
  assert.equal(icons.iconName('Империум/Космодесант'), 'sword');
  assert.equal(icons.iconName('Сборники/Галактика ужасов'), 'skull');
});

test('music folders and spoken audio have appropriate icons with useful fallbacks', () => {
  assert.equal(icons.iconName('Музыка'), 'music');
  assert.equal(icons.iconName('Альбомы/Неизвестный исполнитель', 'music'), 'music');
  assert.equal(icons.iconName('Подкасты', 'music'), 'headphones');
  assert.equal(icons.iconName('Аудиокниги'), 'headphones');
  assert.equal(icons.iconName('Неизвестная серия'), 'book-open');
  assert.equal(icons.iconName('', 'folder'), 'folder');
  assert.equal(icons.iconName(null), 'book-open');
});

test('inline markup is decorative, inherits color, and never interpolates folder input', () => {
  const dangerous = '<img src=x onerror=alert(1)>"</svg><script>alert(2)</script>';
  const svg = icons.markup(dangerous, dangerous);
  assert.match(svg, /^<svg\s/);
  assert.match(svg, /class="category-icon"/);
  assert.match(svg, /viewBox="0 0 24 24"/);
  assert.match(svg, /stroke="currentColor"/);
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /focusable="false"/);
  assert.match(svg, /data-icon="book-open"/);
  assert.doesNotMatch(svg, /<script|<img|onerror|alert|https?:/i);
  assert.equal(svg, icons.markup('Unknown'));
  assert.match(icons.markup('Инквизиция'), /data-icon="eye"/);
});

test('the same helper runs as a browser script without require or runtime network', () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../category-icons.js'), 'utf8'), context);
  assert.equal(context.categoryIcons.iconName('Хаос'), 'flame');
  assert.match(context.categoryIcons.markup('Гвардия'), /data-icon="shield"/);
});
