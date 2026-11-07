# AGENTS.md

Tarjeta de presentación digital de una sola página para {Dr.Code} (Jordi Morales).
`index.html` contiene markup, CSS y manipulación del DOM; la lógica de negocio pura vive en `assets/logic.js`.
No hay build, bundler, linter ni dependencias: los tests usan `node:test`, ya incluido en Node.

## Flujo de trabajo

- Tests: `node --test` (descubre `tests/*.test.js`). Un solo archivo: `node --test tests/logic.test.js`.
- No hay `package.json`: no ejecutes `npm test` ni agregues dependencias. No introduzcas bundler ni linter.
- Verifica abriendo `index.html` en el navegador (o `python -m http.server 8000`) en viewport móvil (~390×844) y desktop (≥768px).
- `html`/`body` tienen `overflow: hidden`: el layout es una tarjeta de viewport fijo, no un documento con scroll.
- **Dos sitios**: la web oficial es `https://idroj001.github.io/web-drcode/` (a donde apunta el icono del globo) y la tarjeta compartible es `https://idroj001.github.io/tarjeta-drcode/` (repo `Idroj001/tarjeta-drcode`, este repo, publicado vía GitHub Pages branch `main`/root). El QR, `SHARE_URL` y las metas sociales (`canonical`, `og:url`, `og:image`, `twitter:image`) apuntan a la tarjeta.

## Qué editar

- Markup, estilos (bloque `<style>`) y manipulación del DOM viven en `index.html`. La lógica pura (mensaje/URL de WhatsApp, validación, estado del panel) vive en `assets/logic.js` y se prueba en `tests/`.
- `assets/logic.js` es UMD: expone `globalThis.DrCodeLogic` en el navegador y `module.exports` en Node. Mantén ese dual export (permite `file://` y `node:test` sin build); no lo conviertas a ESM.
- El copy de UI está en español: mantenlo así y conserva tildes y entidades `&amp;`.
- Tokens de marca: verde neón `#39ff75` (`--cortina-green-neon`), WhatsApp `#25d366`, `VT323` para `{Dr.Code}`/etiquetas, `Inter` para el cuerpo.
- Iconos: Font Awesome 6.7.2 por cdnjs, skills por devicons/simpleicons + `assets/opencode.svg`.
- Las rutas de assets son relativas (`assets/...`) y deben seguir así para que la página funcione también desde `file://`.
- `assets/bg.png` pesa ~1.8 MB; el comentario del CSS apunta a <500 KB en WebP/JPEG. No agregues imágenes más pesadas.

## Acoplamientos que se rompen fácil

- `index.html` carga `assets/logic.js` antes del `<script>` inline, y ese script debe delegar en `DrCodeLogic` (`validateContact`, `buildContactMessage`, `buildWhatsAppUrl`, `getPanelState`). `tests/integration.test.js` falla si la lógica se duplica inline.

- `togglePanel()` alterna cinco elementos a la vez: `#infoPanel.open`, `#logoWrapper.active`, `#bg.up`, `#clickCatcher.active`, `#hero.off`. Cualquier lógica nueva de abrir/cerrar debe mantenerlos sincronizados.
- `.logo-wrapper` se centra con `transform: translate(-50%,-50%)` y anima con el keyframe propio `fadeUpCentered`. Usar `fadeUp` lo descentra. El estado `active` pone `animation: none` para que el pulso no pelee con el cierre.
- `#contactForm` y `#shareSection` son hermanos dentro de `.panel-body`, ambos usan `.open` y ocultan `#panelBodyMain` (solo el formulario oculta además `.panel-name`). Pasa siempre por `closeSubSections()` antes de abrir otro.
- El layout usa `dvh` (`100dvh`, `top: 48dvh`) por la barra de los navegadores móviles. Mantén `dvh`, no `vh`.
- `body` define `user-select: none`; los inputs lo recuperan con `user-select: text`.
- La accesibilidad es intencional: `role`/`aria-label` en el botón del logo, `focus-visible`, atajos Escape/Enter/Space y un bloque `prefers-reduced-motion` que detiene el marquee de skills. Consérvalos al refactorizar.
- A partir de `min-width: 768px` el body se convierte en tarjeta centrada de 480px; hay además un bloque para landscape/`max-height: 500px`. Prueba ambos.

## Datos de negocio

- El número de WhatsApp `593999806465` está duplicado: en el `href` de `wa.me` y en la constante `WHATSAPP_NUMBER` del script. Cambia los dos.
- El QR de "Compartir" es un PNG pre-renderizado de 600×600 (`assets/qr-compartir.png`) que codifica `https://idroj001.github.io/tarjeta-drcode/`. No se regenera solo; si cambia la URL, vuelve a descargarlo:
  `Invoke-WebRequest "https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=8&ecc=M&data=<url-encoded>" -OutFile assets/qr-compartir.png`
- Siguen como placeholder: LinkedIn `tuUser`, footer `tudominio.com` y Portafolio con `href="#"`. No inventes valores: pregunta.
- Las metas sociales (`canonical`, `og:url`, `og:image`, `twitter:image`) ya usan URL absoluta pública. Si cambia el dominio, actualiza las cuatro.
