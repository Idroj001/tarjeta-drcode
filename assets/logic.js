(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.DrCodeLogic = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function encode(value) {
    return encodeURIComponent(value == null ? '' : value);
  }

  function buildContactMessage(fields) {
    fields = fields || {};

    var msg = 'Hola Dr. Code, quisiera más información.%0A%0A';
    msg += '*Nombre:* ' + encode(fields.name) + '%0A';
    if (fields.email) msg += '*Correo:* ' + encode(fields.email) + '%0A';
    msg += '*Celular:* ' + encode(fields.phone) + '%0A';
    msg += '*Ciudad:* ' + encode(fields.city || 'Quito') + '%0A';
    if (fields.service) msg += '*Servicio:* ' + encode(fields.service);

    return msg;
  }

  function buildWhatsAppUrl(number, msg) {
    return 'https://wa.me/' + number + '?text=' + msg;
  }

  function validateContact(fields) {
    fields = fields || {};
    var name = (fields.name || '').trim();
    var phone = (fields.phone || '').trim();

    if (!name || !phone) return 'Por favor completa Nombre y Celular.';
    return null;
  }

  function getPanelState(open) {
    open = !!open;
    return {
      panelOpen: open,
      wrapperActive: open,
      bgUp: open,
      catcherActive: open,
      heroOff: open,
    };
  }

  function getShareAction(caps) {
    caps = caps || {};
    if (caps.canShare) return 'native';
    if (caps.canCopy) return 'clipboard';
    return 'qr';
  }

  return {
    buildContactMessage: buildContactMessage,
    buildWhatsAppUrl: buildWhatsAppUrl,
    validateContact: validateContact,
    getPanelState: getPanelState,
    getShareAction: getShareAction,
  };
});
