const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const exists = (rel) => fs.existsSync(path.join(root, rel));

test('index.html carga logic.js antes del script inline', () => {
  const logicTag = html.indexOf('<script src="assets/logic.js"></script>');

  assert.notEqual(logicTag, -1, 'falta <script src="assets/logic.js"></script>');

  const inlineTag = html.indexOf('<script>', logicTag);
  assert.ok(inlineTag > logicTag, 'logic.js debe cargarse antes del script inline');
});

test('el formulario delega validación y mensaje en DrCodeLogic', () => {
  assert.match(html, /DrCodeLogic\.validateContact\(/);
  assert.match(html, /DrCodeLogic\.buildContactMessage\(/);
  assert.match(html, /DrCodeLogic\.buildWhatsAppUrl\(/);
  assert.doesNotMatch(html, /\*Nombre:\*/, 'el mensaje no debe construirse inline');
});

test('togglePanel delega el estado en DrCodeLogic.getPanelState', () => {
  assert.match(html, /DrCodeLogic\.getPanelState\(/);
});

test('el título principal usa h1 y el formulario tiene labels asociados', () => {
  assert.match(html, /<h1[^>]*class="panel-title"/);
  for (const field of ['formName', 'formEmail', 'formPhone', 'formCity', 'formService']) {
    assert.match(html, new RegExp('<label[^>]*for="' + field + '"'));
    assert.match(html, new RegExp('id="' + field + '"'));
  }
});

test('los toggles exponen su estado con aria-expanded', () => {
  assert.match(html, /id="logoWrapper"[\s\S]*?aria-expanded="false"/);
  assert.match(html, /id="contactBtn"[^>]*aria-expanded="false"/);
  assert.match(html, /id="shareBtn"[^>]*aria-expanded="false"/);
});

test('el head declara canonical, og absoluto, twitter image y manifest', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/[^"]+"/);
  assert.match(html, /property="og:url" content="https:\/\/[^"]+"/);
  assert.match(html, /property="og:image" content="https:\/\/[^"]+assets\/og-image\.jpg"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /name="twitter:image" content="https:\/\/[^"]+"/);
  assert.match(html, /<link rel="manifest" href="manifest\.webmanifest">/);
  assert.match(html, /<link rel="apple-touch-icon" href="assets\/apple-touch-icon\.png">/);
});

test('el fondo se sirve en WebP con fallback PNG y se precarga', () => {
  assert.match(html, /<link rel="preload" as="image" href="assets\/bg\.webp"[^>]*>/);
  assert.match(html, /image-set\([^)]*bg\.webp[^)]*\)/s);
  assert.match(html, /url\('assets\/bg\.png'\)/);
});

test('las imágenes necesarias existen y el og-image es liviano', () => {
  for (const rel of [
    'assets/bg.webp',
    'assets/og-image.jpg',
    'assets/apple-touch-icon.png',
    'assets/icon-192.png',
    'assets/icon-512.png',
    'manifest.webmanifest',
  ]) {
    assert.ok(exists(rel), 'falta ' + rel);
  }

  const ogBytes = fs.statSync(path.join(root, 'assets/og-image.jpg')).size;
  assert.ok(ogBytes < 300 * 1024, 'og-image.jpg debería pesar <300 KB, pesa ' + ogBytes + ' B');
});

test('los iconos son un sprite inline y ya no se carga Font Awesome', () => {
  assert.doesNotMatch(html, /font-awesome/);
  assert.match(html, /<symbol id="i-whatsapp"/);
  assert.match(html, /<use href="#i-whatsapp"/);
});

test('la sección compartir ofrece compartir nativo y copiar enlace', () => {
  assert.match(html, /id="shareNativeBtn"/);
  assert.match(html, /id="copyLinkBtn"/);
  assert.match(html, /DrCodeLogic\.getShareAction\(/);
});
