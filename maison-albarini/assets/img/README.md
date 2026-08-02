# Imagenes de Maison Albarini

Mientras un archivo no exista, `assets/js/main.js` pinta un relleno degradado
coherente con la paleta y marca el elemento con la clase `is-placeholder`.
En cuanto el archivo aparece con el nombre exacto, la foto entra sola: no hay
que tocar el HTML ni el CSS.

Las ranuras se declaran con `data-img` en `index.html`.

## Banners del hero

Formato recomendado: 1920 x 600, JPG de calidad 80, peso objetivo por debajo
de 250 kB. La composicion debe dejar el tercio izquierdo oscuro y despejado,
porque encima va el titular en blanco.

| Archivo | Contenido |
| --- | --- |
| `hero-01.jpg` | Campana de repuestos con descuento |
| `hero-02.jpg` | Excavadora de nueva generacion |
| `hero-03.jpg` | Flota de alquiler en obra |
| `hero-04.jpg` | Grupo electrogeno de alta potencia |
| `hero-05.jpg` | Tecnico en campo, servicio 24/7 |
| `hero-06.jpg` | Financiamiento, equipo entregado a cliente |

## Tarjetas del mosaico

Formato recomendado: 1200 x 600, JPG de calidad 80. El encuadre debe tolerar
un recorte central, porque la tarjeta usa `object-fit: cover` y varia de
proporcion segun la columna.

| Archivo | Tarjeta | Columnas |
| --- | --- | --- |
| `card-equipos.jpg` | Equipos | 6 |
| `card-servicios.jpg` | Servicios | 3 |
| `card-repuestos.jpg` | Repuestos | 3 |
| `card-alquiler.jpg` | Alquiler de equipos | 3 |
| `card-tecnologia.jpg` | Tecnologia | 3 |
| `card-energia.jpg` | Grupos electrogenos | 6 |
| `card-tienda.jpg` | Tienda de repuestos | 6 |
| `card-portal.jpg` | Portal Maison | 3 |
| `card-novedades.jpg` | Novedades | 3 |
| `card-seguridad.jpg` | Aviso de seguridad | 6 |

`card-tienda.jpg` es la unica que va sobre fondo claro: encima se imprime el
reclamo "1.4 millones de repuestos a tu alcance" en gris oscuro, asi que la
foto debe ser luminosa y con poco ruido en el centro izquierdo.

## Como generarlas

Con una clave de OpenRouter en el entorno:

```bash
python "$HOME/.claude/skills/generate-image/scripts/generate_image.py" "Cinematic wide industrial photograph of a yellow heavy excavator at dusk, dramatic low key lighting, deep shadow on the left third for text overlay, photorealistic" --aspect-ratio 21:9 --resolution 2K -o assets/img/hero-01.jpg
```
