# David Tempero

A personal website for technical notes, useful resources, and project explorations. Built with Astro, TypeScript, Markdown, and plain CSS. Published as a static site on GitHub Pages.

## Local development

Use Node.js 24 LTS (see `.nvmrc`) and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro. No environment variables or external services are required.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run check` | Validate Astro and TypeScript |
| `npm run build` | Generate the static site in `dist/` |
| `npm run test:links` | Check built pages, local assets, and heading anchors |
| `npm run preview` | Preview the production build locally |

## Structure

- `src/pages/`: homepage, About, topic indexes, content routes, and 404 page.
- `src/content/`: Markdown knowledge and project collections.
- `src/components/` and `src/layouts/`: shared interface and page layouts.
- `src/styles/`: responsive site styles.
- `src/lib/content.ts`: knowledge areas and shared content helpers.
- `public/`: favicon and other files copied into the published site.

## Writing content

Add knowledge notes under `src/content/knowledge/<area>/<topic>.md`. Supported areas are `programming`, `electronics`, and `computing`. The folder and area must match. Files automatically appear in the corresponding area index and sidebar.

```yaml
---
title: "A new topic"
description: "A short description for indexes and search previews."
area: programming
order: 5
updated: 2026-11-06
---
```

Write the body in Markdown, starting with level-two headings. The page layout supplies the title and generates a table of contents from level-two and level-three headings. Prefer descriptive labels for resource links.

Add project pages under `src/content/projects/<project>.md` with the same metadata except `area`. Set `order` to control index ordering. Knowledge URLs follow `/knowledge/<area>/<topic>/`; project URLs follow `/projects/<project>/`.

Use `updated` for the date of a substantive content edit, not a formatting or site rebuild. Initial dates reflect the resource edits in the content's Git history. The homepage lists the four most recently updated collections.

The About page is edited directly in `src/pages/about.astro`. Keep personal details and public links intentional.

## Validation and deployment

```sh
npm ci
npm run check
npm run build
npm run test:links
```

The GitHub Actions workflow runs these checks for pull requests targeting `master`. Pushes to `master` and manual runs on `master` also upload `dist/` and deploy to GitHub Pages after validation succeeds. Pull requests do not deploy.

In repository Settings → Pages, the build source must be **GitHub Actions**. The canonical site is `https://davidtempero.github.io`, configured in `astro.config.mjs`, with no repository subpath. No custom domain or server adapter is required.

Generated output, dependencies, and local caches are ignored. Commit `package-lock.json` to keep installations reproducible.
