# Alex Gavalas

A personal website built with Astro, TypeScript, and custom CSS. Static HTML,
self-hosted fonts, and progressive enhancements for interactive project browsing.
No CMS, backend, tracking, or client-side framework.

Typography uses only Source Sans 3, self-hosted through
`@fontsource-variable/source-sans-3` (Latin, upright variable WOFF2).
The page, controls, and 3D tile share the same family with three weights:
400 regular, 500 medium, and 600 semibold. There are no external font requests.

The pine, citron, and dusty-rose palette is defined in `src/styles/theme.css`.
Shared UI colors use these tokens; the 3D tile adds shaded citron and rose
surfaces with pine lettering.

## Development

Use Node.js 24 LTS.

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run build
npm run preview
```

## Content

- `src/data/profile.ts`: introduction, social links, projects, and experience.
- `src/pages/index.astro`: homepage structure, responsive styles, and project tabs.
- `src/components/ProjectObject.astro`: interactive CSS 3D project tile.
- `src/components/ProjectPreview.astro`: shared collapsible website preview.

The homepage links to `public/alex-gavalas-cv.pdf` beneath the role title.
This is the supplied CV, unmodified, including its phone number. Replace that file
to update the download; update the displayed file size if the replacement differs.

## Design and interactions

The Workbench design is the homepage at `/`. The alternative concept routes and
the previous homepage have been removed.

The restrained, product-focused layout includes accessible project tabs, a compact
interactive 3D project tile, and copy-email feedback. The tabs turn the tile;
dragging or turning it updates the selected project details and website preview.
Drag to rotate, use the turn/reset controls, or focus the object and use arrow
keys. Home/Escape reset its orientation. All content and project links remain
outside the object.

The tile is implemented in `src/components/ProjectObject.astro` with its controller in
`src/scripts/project-object.ts`. The object uses six CSS 3D faces, not a WebGL
model or a new rendering dependency.
Its spring controller only runs during interaction and settling. Keyboard changes
and reduced-motion interactions are immediate; vertical touch scrolling is
preserved. Without JavaScript the tile is static, with both projects still linked
alongside it. Physical-device touch gestures have not yet been validated.

## Design engineering skill

`emil-design-eng` is installed project-locally at
`.agents/skills/emil-design-eng/SKILL.md` from
<https://github.com/emilkowalski/skills>. `skills-lock.json` records its source
and content hash. It is not installed globally.

The homepage uses progressive enhancement: without JavaScript both
projects remain visible and all project links work. With JavaScript, tabs support
arrow keys and Home/End, with instant keyboard and reduced-motion changes. Pointer
selection gets a short transform/opacity transition and rotates the object to the
corresponding face. Object controls and dragging update the tabs without moving
keyboard focus. Interrupted turns settle to the latest selection. Clipboard failure
offers the email link instead of showing a false success state.

### Website previews

`ProjectPreview.astro` provides a full-width, collapsible preview below the 3D
viewer. Its single open/closed state persists when switching projects.
Embeddable sites use a lazy-loaded, sandboxed iframe with a descriptive
title and no referrer. A new-tab link remains available if the frame fails or a
feature requires the full website. Previews are for browsing, not testing accounts.

Both HabitThread and Learning Path currently allow framing and have
`previewEmbeddable: true` in `src/data/profile.ts`. If a site's headers later block
embedding, set its flag to `false` to show the explicit fallback. This repository
cannot override a remote site's framing policy; no proxy or security-header bypass
is used. Project and preview links use filled primary buttons and outlined
secondary buttons so opening the full sites remains easy to discover.

## Cloudflare Pages

Connect the Git repository in Cloudflare Pages:

- Framework preset: **Astro**
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `NODE_VERSION=24`

No Cloudflare adapter is needed for this static site. Deployment has not been
configured by the application itself. Once the final domain is known, set `site`
in `astro.config.mjs` and add a canonical URL and sitemap.
