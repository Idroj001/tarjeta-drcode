# AGENTS.md

Tarjeta de presentación digital de una sola página para {Dr.Code} (Jordi Morales). Un solo `index.html` con markup, CSS y DOM; lógica pura en `assets/logic.js`.

> **Estándares de diseño y tipografía generales: ver el `AGENTS.md` del workspace root (`Proyectos/`).** Tarjeta es la variante más divergente a propósito: tokens `--cortina-*`, VT323 + Inter, CSS/JS inline. No homogeneizar. Aquí solo el cableado crítico del repo.

## Flujo de trabajo

- Tests: `node --test` (sin `package.json`: nunca `npm test`, no agregar dependencias, bundler ni linter).
- `html`/`body` con `overflow: hidden`: tarjeta de viewport fijo, no documento con scroll. El layout usa `dvh` (no `vh`) por la barra de los navegadores móviles.
- Dos sitios más la landing: web oficial `https://idroj001.github.io/web-drcode/`, landing `https://idroj001.github.io/DrCode-landing/` y tarjeta compartible `https://idroj001.github.io/tarjeta-drcode/` (este repo, Pages desde root). El QR, `SHARE_URL` y metas sociales apuntan a la tarjeta.
- `.panel-social` tiene 4 enlaces: Web (`#i-globe`), Facebook, GitHub, LinkedIn. (El botón de catálogo se agregará ahí más adelante — decidido por el usuario, no reponer el de Landing.)
- Carrusel de skills: GitHub va en **blanco** vía `https://cdn.simpleicons.org/github/FFFFFF` (misma CDN que Warp/Obsidian/Hostinger); OpenCode va en blanco por CSS (`filter: brightness(0) invert(1)` en `img[alt="OpenCode"]`). Los iconos negros de devicon no contrastan con el fondo oscuro: si agregas uno, usa simpleicons con color explícito o el filter.

## Acoplamientos que se rompen fácil

- `assets/logic.js` es **UMD dual**: expone `globalThis.DrCodeLogic` en el navegador y `module.exports` en Node. Mantén ese export; no lo conviertas a ESM.
- `index.html` carga `logic.js` antes del `<script>` inline, que debe delegar en `DrCodeLogic` (`validateContact`, `buildContactMessage`, `buildWhatsAppUrl`, `getPanelState`). `tests/integration.test.js` falla si la lógica se duplica inline.
- `togglePanel()` alterna cinco elementos a la vez: `#infoPanel.open`, `#logoWrapper.active`, `#bg.up`, `#clickCatcher.active`, `#hero.off`. Mantenlos sincronizados.
- `.logo-wrapper` se centra con `transform: translate(-50%,-50%)` y anima con `fadeUpCentered` (usar `fadeUp` lo descentra). El estado `active` pone `animation: none`.
- `#contactForm` y `#shareSection` comparten `.open` y ocultan `#panelBodyMain`; pasa siempre por `closeSubSections()` antes de abrir otro.
- Accesibilidad intencional: `role`/`aria-label` en el logo, `focus-visible`, Escape/Enter/Space y `prefers-reduced-motion`. Consérvalos.

## Datos de negocio

- WhatsApp `593999806465` está duplicado: `href` de `wa.me` y `WHATSAPP_NUMBER` del script. Cambia los dos.
- QR pre-renderizado 600×600 (`assets/qr-compartir.png`) que codifica la URL de la tarjeta. Si cambia la URL, regenerarlo:
  `Invoke-WebRequest "https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=8&ecc=M&data=<url-encoded>" -OutFile assets/qr-compartir.png`
- Placeholders actuales: footer `tudominio.com` y Portafolio `href="#"` — no inventes valores, pregunta.
- Metas sociales (`canonical`, `og:url`, `og:image`, `twitter:image`) usan URL absoluta; si cambia el dominio, actualiza las cuatro.
