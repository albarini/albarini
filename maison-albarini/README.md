# Maison Albarini

Portada corporativa construida calcando la arquitectura, la retica y el
sistema visual de `ferreyros.com.pe`, medidos elemento por elemento con
Playwright sobre la pagina real.

Vive en una carpeta propia y no toca el sitio de Aedora Maison que ocupa la
raiz del repositorio. Se sirve como estatico, igual que el resto: sin build,
sin dependencias, sin framework.

## Ver en local

```bash
python -m http.server 5173 --directory .
```

Luego abrir `http://localhost:5173/maison-albarini/`.

## Estructura

```
maison-albarini/
  index.html
  assets/
    css/
      base.css        tokens, reset, escala tipografica
      layout.css      contenedor, cabecera, rejilla, pie
      components.css  hero, mosaico, botones, cajon, responsive
    js/
      main.js         carrusel, megamenu, cajon, revelado, relleno de imagenes
    img/
      README.md       las 16 fotos que faltan, con nombre y encuadre
```

## Medidas calcadas de la referencia

| Elemento | Referencia | Aqui |
| --- | --- | --- |
| Contenedor | 1200 px | 1200 px |
| Cabecera | 152 px | 152 px |
| Hero | 472 px, 6 diapositivas | 472 px, 6 diapositivas |
| Mosaico | 10 tarjetas, 12 columnas, canal 8 px | igual |
| Amarillo de marca | `#fbbd00` | `#fbbd00` |
| Tinta | `#333333`, `#666666`, `#212529` | igual |
| Velo de tarjeta | `rgba(51, 51, 51, .7)` | igual |

La referencia usa Univers Condensed, que es tipografia licenciada de
Caterpillar. Aqui se sustituye por Roboto Condensed, el neogrotesco condensado
mas cercano disponible en Google Fonts, con Roboto y Arial para el cuerpo.

## Lo que hay que sustituir antes de publicar

- Las 16 fotografias descritas en `assets/img/README.md`. Mientras falten, el
  sitio pinta un degradado de relleno y no se rompe.
- El RUC del pie: `20601234567` es un marcador de posicion.
- Los correos `clientes@maisonalbarini.pe` y `repuestos@maisonalbarini.pe`, y
  los telefonos de call center. El WhatsApp `920 417 300` si es el real.
- Los destinos de los enlaces, que hoy son anclas dentro de la propia pagina.
