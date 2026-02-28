# ACBIM Modern Redesign

Site statique Next.js (export HTML), oriente conversion, mobile et SEO local.

## Stack

- `Next.js 15` (App Router)
- `React 19`
- `Tailwind CSS`
- Export statique (`next build`) compatible hebergement FTP/PHP

## Lancement local

```bash
npm install
npm run dev
```

Preview local de l'export statique (dossier `out/`) :

```bash
npm run build
npm run preview
```

`npm run start` est un alias de `npm run preview` (serveur statique local).

## Build de production (FTP)

```bash
npm run build
```

Le dossier a deployer est `out/`.
Le `build` lance automatiquement une phase `prebuild` qui regenere les images optimisees.

`npm run export` est un alias de `npm run build` (et conserve donc le `prebuild`).

## Deploiement Cloudflare Pages (Git)

- Framework: `Next.js`
- Build command: `npm run build`
- Output directory: `out`
- Variables d'environnement minimales:
  - `NEXT_PUBLIC_SITE_URL=https://www.aura-bim.fr`
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-5X4N22V2B0`

Important: `contact.php` ne peut pas s'executer sur Cloudflare Pages.
Pour garder le formulaire en V1, definir:

- `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://<ton-endpoint-php>/contact.php`

Exemple: endpoint PHP heberge sur OVH.

## Optimisation images (sans Cloudinary)

Script: `tools/optimize-images.mjs`

Commande generale:

```bash
npm run images:build
```

Cette commande traite tout `RESSOURCES/images` (recursif).

- Source par defaut: `RESSOURCES/images`
- Cible par defaut: `public/images/optimized`
- Manifest genere: `public/images/optimized/manifest.json`

Commande dediee Hero:

```bash
npm run images:hero
```

- Source: `RESSOURCES/images/hero`
- Cible: `public/images/hero`
- Tailles generees: `768`, `1280`, `1600`
- Fallback genere: `nom-image.webp`
- Le carrousel `Hero` lit automatiquement `public/images/hero/manifest.json`:
  apres generation, les nouvelles images sont integrees sans modifier `components/Hero.tsx`.

Exemples de fichiers produits:

- `public/images/hero/mon-image-w768.webp`
- `public/images/hero/mon-image-w1280.webp`
- `public/images/hero/mon-image-w1600.webp`
- `public/images/hero/mon-image.webp`

## Ajouter un service

1. Ouvrir `content/services.json`
2. Dupliquer un objet existant
3. Renseigner les champs:
- `slug` unique
- `title`, `subtitle`, `description`
- `imageUrl` (ideally webp)
- `iconKey` (`cube`, `camera`, `scan`, `collection`, `drone`, `virtual-tour`)
- `benefits` (liste)
- `process` (liste avec `title`, `description`, `iconKey`)
- `relatedProjects` (slugs de projets, optionnel)
4. Sauvegarder puis `npm run build`

## Ajouter une realisation

1. Ouvrir `content/projects.json`
2. Dupliquer un objet existant
3. Renseigner les champs:
- `slug` unique
- `title`, `category`, `excerpt`, `description`
- `imageUrl` (image principale)
- `gallery` (liste d'images)
- `services` (slugs de services lies)
- `tags` (utilises par le filtre dynamique)
- `client`, `date`, `publishedAt` (`YYYY-MM-DD`)
4. Sauvegarder puis `npm run build`

## SEO

- Domaine canonique via `NEXT_PUBLIC_SITE_URL` (defaut: `https://www.aura-bim.fr`)
- Metadonnees + OpenGraph + Twitter sur les pages principales
- Donnees structurees JSON-LD (`Organization`, `Service`, `CreativeWork`, `Breadcrumb`)
- `sitemap.xml` et `robots.txt` generes automatiquement

## Deploiement WinSCP

Script disponible: `deploy-winscp.txt`.
Lancer d'abord le build, puis synchroniser `out/` vers le repertoire FTP cible.
