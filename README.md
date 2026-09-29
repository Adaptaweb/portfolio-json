# Portafolio y CV · Alejandro Tamayo

Portafolio personal con casos de estudio y un currículum descargable, generados desde un único `src/data/cv.json` (esquema de [JSON Resume](https://jsonresume.org/schema/) con algunos campos propios para los casos de estudio).

Proyecto original basado en [minimalist-portfolio-json](https://github.com/midudev/minimalist-portfolio-json) de midudev.

## Stack

- [Astro 7](https://astro.build/) — sitio estático, sin framework de UI.
- TypeScript.
- Tipografías autoalojadas con Fontsource: Onest y JetBrains Mono.
- Videos de demostración en `public/media/`, que se reproducen solo mientras están en pantalla.
- View Transitions nativas entre páginas (`@view-transition`), sin JavaScript extra.
- Paleta de comandos propia con `<dialog>` (`Ctrl` + `K`).

## Páginas

| Ruta | Contenido |
| :-- | :-- |
| `/` | Tarjeta de perfil fija, sobre mí, proyectos, experiencia y stack. |
| `/casos/<slug>` | Detalle de proyecto generado a partir de `projects` en `src/data/cv.json` (los que tienen texto, videos o son de Workmate). |
| `/cv` | CV tamaño carta listo para imprimir, con versión ATS (`?ats=1`) y opción sin foto (`?foto=0`). |
| `/og` | Tarjeta de 1200 × 630 que se captura como imagen para compartir (no se indexa). |

## Comandos

| Comando | Acción |
| :-- | :-- |
| `npm run dev` | Servidor de desarrollo en `localhost:4321`. |
| `npm run build` | `astro check` y build de producción en `./dist/`. |
| `npm run preview` | Sirve el build localmente. |
| `npm run assets` | Genera `public/cv-alejandro-tamayo.pdf`, `public/cv-alejandro-tamayo-ats.pdf` y `public/og.png` con Chrome o Edge en modo headless. |

Después de editar `src/data/cv.json`, ejecuta `npm run assets` y sube los archivos de `public/` para que los PDF descargables queden al día. Si el navegador no está en la ruta por defecto, define `CHROME_PATH`.

## Licencia

MIT.
