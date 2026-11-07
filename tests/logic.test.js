const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildContactMessage,
  buildWhatsAppUrl,
  validateContact,
  getPanelState,
} = require('../assets/logic.js');

test('buildContactMessage codifica todos los campos en el texto de WhatsApp', () => {
  const msg = buildContactMessage({
    name: 'Ana Pérez',
    email: 'ana@mail.com',
    phone: '+593 99 123 4567',
    city: 'Quito',
    service: 'Carrito de Compra / WhatsApp',
  });

  assert.equal(
    msg,
    'Hola Dr. Code, quisiera más información.%0A%0A' +
      '*Nombre:* Ana%20P%C3%A9rez%0A' +
      '*Correo:* ana%40mail.com%0A' +
      '*Celular:* %2B593%2099%20123%204567%0A' +
      '*Ciudad:* Quito%0A' +
      '*Servicio:* Carrito%20de%20Compra%20%2F%20WhatsApp'
  );
});

test('buildContactMessage omite correo y servicio vacíos y usa Quito por defecto', () => {
  const msg = buildContactMessage({ name: 'Ana', phone: '099' });

  assert.equal(
    msg,
    'Hola Dr. Code, quisiera más información.%0A%0A' +
      '*Nombre:* Ana%0A' +
      '*Celular:* 099%0A' +
      '*Ciudad:* Quito%0A'
  );
});

test('buildWhatsAppUrl arma el enlace wa.me sin re-codificar el mensaje', () => {
  const url = buildWhatsAppUrl('593999806465', 'Hola%20mundo');

  assert.equal(url, 'https://wa.me/593999806465?text=Hola%20mundo');
});

test('validateContact acepta nombre y celular con contenido', () => {
  assert.equal(validateContact({ name: 'Ana', phone: '0991234567' }), null);
});

test('validateContact rechaza nombre vacío', () => {
  assert.equal(
    validateContact({ name: '  ', phone: '0991234567' }),
    'Por favor completa Nombre y Celular.'
  );
});

test('validateContact rechaza celular vacío', () => {
  assert.equal(
    validateContact({ name: 'Ana', phone: '   ' }),
    'Por favor completa Nombre y Celular.'
  );
});

test('getPanelState enciende las cinco clases al abrir', () => {
  assert.deepEqual(getPanelState(true), {
    panelOpen: true,
    wrapperActive: true,
    bgUp: true,
    catcherActive: true,
    heroOff: true,
  });
});

test('getPanelState apaga las cinco clases al cerrar', () => {
  assert.deepEqual(getPanelState(false), {
    panelOpen: false,
    wrapperActive: false,
    bgUp: false,
    catcherActive: false,
    heroOff: false,
  });
});
