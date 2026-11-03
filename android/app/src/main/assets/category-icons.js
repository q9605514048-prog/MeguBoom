/* Lucide SVG geometry, ISC / Feather MIT. See assets/icons/LICENSE.lucide.txt. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.categoryIcons = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  // Finite trusted local geometry: folder names are never inserted into HTML.
  const shapes = Object.freeze({
  "cog": "<path d=\"M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z\" /><path d=\"M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z\" /><path d=\"M12 2v2\" /><path d=\"M12 22v-2\" /><path d=\"m17 20.66-1-1.73\" /><path d=\"M11 10.27 7 3.34\" /><path d=\"m20.66 17-1.73-1\" /><path d=\"m3.34 7 1.73 1\" /><path d=\"M14 12h8\" /><path d=\"M2 12h2\" /><path d=\"m20.66 7-1.73 1\" /><path d=\"m3.34 17 1.73-1\" /><path d=\"m17 3.34-1 1.73\" /><path d=\"m11 13.73-4 6.93\" />",
  "cpu": "<rect width=\"16\" height=\"16\" x=\"4\" y=\"4\" rx=\"2\" /><rect width=\"6\" height=\"6\" x=\"9\" y=\"9\" rx=\"1\" /><path d=\"M15 2v2\" /><path d=\"M15 20v2\" /><path d=\"M2 15h2\" /><path d=\"M2 9h2\" /><path d=\"M20 15h2\" /><path d=\"M20 9h2\" /><path d=\"M9 2v2\" /><path d=\"M9 20v2\" />",
  "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "flame": "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\" />",
  "swords": "<polyline points=\"14.5 17.5 3 6 3 3 6 3 17.5 14.5\" /><line x1=\"13\" x2=\"19\" y1=\"19\" y2=\"13\" /><line x1=\"16\" x2=\"20\" y1=\"16\" y2=\"20\" /><line x1=\"19\" x2=\"21\" y1=\"21\" y2=\"19\" /><polyline points=\"14.5 6.5 18 3 21 3 21 6 17.5 9.5\" /><line x1=\"5\" x2=\"9\" y1=\"14\" y2=\"18\" /><line x1=\"7\" x2=\"4\" y1=\"17\" y2=\"20\" /><line x1=\"3\" x2=\"5\" y1=\"19\" y2=\"21\" />",
  "shield": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" />",
  "sword": "<polyline points=\"14.5 17.5 3 6 3 3 6 3 17.5 14.5\" /><line x1=\"13\" x2=\"19\" y1=\"19\" y2=\"13\" /><line x1=\"16\" x2=\"20\" y1=\"16\" y2=\"20\" /><line x1=\"19\" x2=\"21\" y1=\"21\" y2=\"19\" />",
  "orbit": "<circle cx=\"12\" cy=\"12\" r=\"3\" /><circle cx=\"19\" cy=\"5\" r=\"2\" /><circle cx=\"5\" cy=\"19\" r=\"2\" /><path d=\"M10.4 21.9a10 10 0 0 0 9.941-15.416\" /><path d=\"M13.5 2.1a10 10 0 0 0-9.841 15.416\" />",
  "crown": "<path d=\"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z\" /><path d=\"M5 21h14\" />",
  "library-big": "<rect width=\"8\" height=\"18\" x=\"3\" y=\"3\" rx=\"1\" /><path d=\"M7 3v18\" /><path d=\"M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z\" />",
  "skull": "<path d=\"m12.5 17-.5-1-.5 1h1z\" /><path d=\"M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z\" /><circle cx=\"15\" cy=\"12\" r=\"1\" /><circle cx=\"9\" cy=\"12\" r=\"1\" />",
  "music": "<path d=\"M9 18V5l12-2v13\" /><circle cx=\"6\" cy=\"18\" r=\"3\" /><circle cx=\"18\" cy=\"16\" r=\"3\" />",
  "headphones": "<path d=\"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3\" />",
  "book-open": "<path d=\"M12 7v14\" /><path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\" />",
  "folder": "<path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\" />"
});
  const categories = [
    [/коул|cawl/i, 'cpu'],
    [/механикус|механикум|скитарий|кузниц|марса|mechanicus/i, 'cog'],
    [/инквиз|эйзенхорн|рейвенор|биквин|крипты|inquisit/i, 'eye'],
    [/хаос|ариман|несущие|люций|повелители ночи|chaos/i, 'flame'],
    [/ересь|хорус|примарх|терры|horus/i, 'swords'],
    [/гвард|каин|яррик|кадия|гаунт|северина|astra militarum/i, 'shield'],
    [/космодесант|астартес|рыцар|ангел|волк|саламандр|кархародон|space marine/i, 'sword'],
    [/ксенос|эльдар|гоббо|уфтхак|некрон|тау|xenos/i, 'orbit'],
    [/империум|событи|кампани|imperium/i, 'crown'],
    [/ужас|хоррор|ноч|т[её]мный|horror/i, 'skull'],
    [/сборник|рассказ|истори|роман|повест|фанфик|антологи|stories/i, 'library-big'],
    [/аудиокниг|подкаст|headphones|podcast/i, 'headphones'],
    [/музык|music|плейлист|альбом/i, 'music']
  ];
  function iconName(pathOrName, kind = 'book') {
    const parts = String(pathOrName == null ? '' : pathOrName).normalize('NFKC').split(/[\\/]+/).filter(Boolean);
    if (kind === 'music') return parts.some(part => /подкаст|podcast|аудиокниг/i.test(part)) ? 'headphones' : 'music';
    for (let index = parts.length - 1; index >= 0; index--) {
      const name = parts[index].replace(/^\s*\d+[.\s)_-]*/, '').trim();
      for (const [pattern, icon] of categories) if (pattern.test(name)) return icon;
    }
    return kind === 'folder' ? 'folder' : 'book-open';
  }
  function markup(pathOrName, kind = 'book') {
    const name = iconName(pathOrName, kind);
    return '<svg class="category-icon" data-icon="' + name + '" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + shapes[name] + '</svg>';
  }
  return Object.freeze({ iconName, markup });
});
