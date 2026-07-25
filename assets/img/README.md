# Assets · imágenes

Todas las piezas ya están generadas a partir de las fotos de la marca. Los
originales sin recortar viven en `_source/`, fuera del control de versiones.

## Qué hay ahora

| Archivo | Dimensiones | Contenido |
|---|---|---|
| `hero-poster.jpg` | 1920×872 | Fotograma del vídeo de portada (segundo 2) |
| `project-01.jpg` | 810×1080 | Villa Duna · aérea al atardecer |
| `project-02.jpg` | 668×501 | Casa Araucaria · aérea entre araucarias |
| `project-03.jpg` | 1077×606 | Residencia Nogal · salón con listones de madera |
| `project-04.jpg` | 1000×750 | Casa Mirador · cocina y comedor de hormigón |
| `project-05.jpg` | 810×1080 | Villa Oasis · acceso porticado con celosías |
| `service-01…06.jpg` | 4:5 | Vistas previas del acordeón de servicios |
| `testimonial-bg.jpg` | 1000×600 | Fondo del testimonio |
| `og-cover.jpg` | 1077×564 | Miniatura para redes sociales |

## Cómo se generaron

Recorte centrado a la proporción de cada hueco, **sin reescalar hacia arriba**,
con calidad JPEG 3 de ffmpeg:

```bash
ffmpeg -i origen.jpg -vf "crop=810:1080" -q:v 3 assets/img/project-01.jpg
```

## Limitación a tener en cuenta

Las fotos de origen miden entre 668 y 1080 px de lado, porque proceden de
Instagram, que recomprime y reduce todo lo que se sube. En pantallas grandes
—sobre todo en `project-03`, que ocupa el ancho completo— se notará algo de
falta de nitidez.

**Si tienes los originales de cámara o del render, sustitúyelos**: vuelve a
lanzar los mismos recortes sobre los archivos de alta resolución y el salto de
calidad será evidente. Los tamaños ideales serían el doble de los actuales
(1620×2160 para las verticales, 2154×1212 para la apaisada).

## Vídeo

`../video/hero.mp4` — 15,6 MB, H.264, 1920×872, 30 fps, sin audio, con
`+faststart`. Generado a partir del original de 387 MB en 4756×2160 (HEVC),
que sigue en `_source/`.
