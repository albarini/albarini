# Landing Page Premium · plantilla de marca blanca

Clon de la estética y la UX de *Studio Couture*, construido como plantilla
reutilizable. **HTML5 semántico + CSS3 moderno + Vanilla JS**, sin dependencias,
sin build y sin peticiones a terceros (salvo la hoja de Google Fonts, opcional).

Abre `index.html` en el navegador y funciona. No hace falta servidor.

---

## 1 · Estructura

```
.
├── index.html                  Documento único, semántico y comentado para CMS
├── assets/
│   ├── css/
│   │   ├── base.css            Tokens de diseño + reset + tipografía   ← el branding vive aquí
│   │   ├── layout.css          Contenedores y ritmo vertical
│   │   ├── components.css      Navbar, menú, botones, formulario, cursor, loader
│   │   ├── sections.css        Estilos por sección
│   │   └── animations.css      Estados de reveal, keyframes, reduced-motion
│   ├── js/
│   │   ├── core/
│   │   │   ├── app.js          Namespace SC, configuración y registro de módulos
│   │   │   ├── utils.js        Helpers (lerp, damp, split de texto, resize único)
│   │   │   └── ticker.js       Un solo requestAnimationFrame para toda la página
│   │   ├── modules/            13 módulos independientes (ver tabla abajo)
│   │   └── main.js             Punto de entrada
│   ├── img/                    (README con los nombres de archivo esperados)
│   ├── video/                  hero.mp4 / hero.webm
│   └── fonts/                  Para autoalojar las tipografías si se prefiere
```

**Orden de carga de CSS:** tokens → layout → componentes → secciones → animaciones.
La cascada es intencional: nunca hace falta `!important`.

---

## 2 · Los módulos JavaScript

Cada módulo es una función `init(root)` que devuelve `{ destroy }`. Ninguno conoce
a los demás; se comunican por el estado compartido `SC.scroll` y por eventos
(`sc:loaded`, `sc:anchor`).

| Módulo | Qué hace |
|---|---|
| `preloader` | Cortina inicial con barra de progreso |
| `media-fallback` | Dibuja marcadores de posición si aún no existen las imágenes/vídeo |
| `smooth-scroll` | Scroll interpolado tipo Lenis, sobre `scrollTo` nativo |
| `navbar` | Transparente → sólida; se oculta al bajar; submenú accesible |
| `menu` | Overlay móvil con clip-path, bloqueo de scroll y gestión de foco |
| `reveal` | Fade-up con Intersection Observer; variante palabra a palabra |
| `text-fill` | Titular que pasa de gris a tinta según el progreso del scroll |
| `counter` | Cuenta ascendente de las cifras al entrar en pantalla |
| `parallax` | Desplazamiento a distinta velocidad, con medidas cacheadas |
| `magnetic` | Botones que se atraen hacia el cursor |
| `cursor` | Punto + anillo con inercia y etiqueta contextual |
| `services` | Acordeón + vista previa de imagen que sigue al ratón |
| `lead-form` | Validación en cliente, honeypot y envío asíncrono |

### Un solo bucle de animación

Todo lo que se anima por frame (`smooth-scroll`, `parallax`, `cursor`,
`magnetic`, `text-fill`) se suscribe a `SC.ticker`. El scroll se lee **una vez
por frame** y se reparte por orden de prioridad. Evita reflows en cascada y
mantiene las animaciones sincronizadas.

```js
var off = SC.ticker.add(function (dt, time) { /* … */ }, 30); // menor orden = antes
off(); // baja
```

### Interpolación independiente del framerate

`SC.utils.damp(actual, destino, lambda, dt)` en lugar de un `lerp` fijo por
frame: la animación se ve igual a 60 Hz que a 144 Hz.

---

## 3 · Personalizar la marca (white label)

Casi todo se cambia en `assets/css/base.css`:

```css
:root {
  --c-ink:     #0a0a0a;   /* tinta principal */
  --c-accent:  #0a0a0a;   /* color del CTA */
  --c-bg-soft: #f2f3f5;   /* fondo de las secciones claras */
  --font-sans:  'Jost', …;
  --font-serif: 'Cormorant Garamond', …;
  --section-y: clamp(5.5rem, 11vw, 11rem);  /* ritmo vertical */
}
```

Los parámetros de movimiento están centralizados en `assets/js/core/app.js`:

```js
SC.config.smoothScroll.lerp = 0.09;   // 0 = más lento, 1 = instantáneo
SC.config.magnetic.strength = 0.32;
SC.config.parallax.max = 140;
SC.config.reveal.once = true;         // false = re-anima al volver a entrar
```

Textos, nombre de marca y datos de contacto están en `index.html` marcados con
comentarios `<!-- CMS: … -->`.

---

## 4 · Assets

Las rutas son **relativas** (`./assets/img/project-01.jpg`) para que un CMS pueda
sustituirlas por variables. Consulta `assets/img/README.md` para la lista exacta
de archivos y tamaños. Mientras no existan, `media-fallback.js` pinta un
marcador degradado con la etiqueta del `data-media-fallback`, así que la maqueta
es presentable desde el primer minuto.

---

## 5 · Conectar el formulario

El único punto de integración es el atributo `action`:

```html
<form id="lead-form" action="./api/lead" method="post">
```

- **PHP** → `action="/enviar.php"`
- **Node/Express** → `action="/api/lead"`, `req.body` con `multer` o `express.urlencoded`
- **Servicios externos** (Formspree, Basin, HubSpot) → pega su endpoint

El módulo envía `FormData` con `Accept: application/json` y espera un `2xx`.
Incluye honeypot anti-spam (campo `company`).

> **Modo demo:** si el endpoint no existe, confirma el envío igualmente para poder
> revisar el flujo. Antes de publicar, desactívalo:
> ```html
> <form id="lead-form" action="/api/lead" method="post" data-demo="off">
> ```

---

## 6 · Migrar a un framework

La arquitectura está pensada para moverse sin reescribir nada.

### React / Next.js

Los módulos ya tienen la forma exacta de un efecto con limpieza:

```jsx
import { useEffect, useRef } from 'react';

export default function Hero() {
  const ref = useRef(null);

  useEffect(() => {
    const instance = SC.modules.parallax(ref.current);
    return () => instance?.destroy();   // ← el destroy que ya devuelve el módulo
  }, []);

  return <section ref={ref} className="hero">…</section>;
}
```

Importa los CSS en `app/layout.tsx` (o `_app.js`) en el mismo orden del `<head>`.
En Next.js, `assets/` va a `public/` y las rutas siguen funcionando tal cual.

### Vue 3

```js
onMounted(() => { instance = SC.modules.reveal(el.value); });
onUnmounted(() => instance?.destroy());
```

### Convertir a ES Modules

Añade `export default` a cada archivo, cambia `SC.register(...)` por
`export function init(root)` y sustituye los `<script defer>` por un único
`<script type="module" src="./assets/js/main.js">`. **Requiere servidor**
(los módulos ES no cargan por `file://`).

### PHP / plantillas de servidor

`index.html` es HTML plano: renómbralo a `.php` y trocéalo en `header.php`,
`sections/*.php` y `footer.php`. Los comentarios `<!-- CMS: -->` marcan cada
punto donde entra un bucle o una variable.

---

## 7 · Accesibilidad y rendimiento

- Sin JavaScript la página se ve **completa**: los estados iniciales de las
  animaciones cuelgan de `html.js`.
- `prefers-reduced-motion` desactiva smooth-scroll, parallax, cursor y reveals.
- En táctil se usa el scroll nativo (mejor que cualquier emulación).
- Navegación por teclado, `aria-expanded` en acordeón y submenús, `role="status"`
  en el formulario, `skip-link` y anillos de foco visibles.
- Imágenes con `loading="lazy"` + `decoding="async"`; el `will-change` se libera
  cuando la animación termina.
- El bucle de rAF se pausa cuando la pestaña deja de estar visible.

---

## 8 · Antes de publicar

- [ ] Sustituir imágenes y vídeo en `assets/img` y `assets/video`
- [ ] Cambiar nombre de marca, textos y datos de contacto en `index.html`
- [ ] Ajustar `--c-accent` y las fuentes en `base.css`
- [ ] Apuntar el `action` del formulario y poner `data-demo="off"`
- [ ] Actualizar `<title>`, `<meta name="description">`, `og:image` y el JSON-LD
- [ ] Autoalojar las fuentes en `assets/fonts/` si no quieres depender de Google
- [ ] Añadir `favicon.ico` y `site.webmanifest`
