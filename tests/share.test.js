const test = require('node:test');
const assert = require('node:assert/strict');

const { getShareAction } = require('../assets/logic.js');

test('getShareAction usa la hoja nativa cuando el navegador la soporta', () => {
  assert.equal(getShareAction({ canShare: true, canCopy: true }), 'native');
});

test('getShareAction copia el enlace si no hay share nativo', () => {
  assert.equal(getShareAction({ canShare: false, canCopy: true }), 'clipboard');
});

test('getShareAction cae al QR si no hay share ni clipboard', () => {
  assert.equal(getShareAction({ canShare: false, canCopy: false }), 'qr');
});
