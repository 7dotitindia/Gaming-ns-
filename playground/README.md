# PLAYGROUND

Premium gaming creative marketplace. React 18 + Vite + Tailwind + Framer Motion.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # vite build + static prerender (100+ routes, sitemap)
```

## Structure

- `src/lib/data.js` — all demo content (assets, kits, creators, shots, guides). Presentation components never hold content.
- `src/lib/editor.js` — Studio document model, templates and canvas renderer (shared by the editor and the homepage preview).
- `src/lib/store.jsx` — app state (favorites, downloads, designs, follows) persisted in `localStorage`.
- `src/components/` — `ui.jsx` (cards, search, modal, tabs), `Layout.jsx` (nav/footer), `Previews.jsx`, `Art.jsx` (placeholder artwork).
- `src/pages/` — Home, Explore, AssetDetail, Esports, Studio, Tools, Inspiration, Learn, Community, Dashboard, Admin.
- Design tokens: CSS variables in `src/index.css` mapped in `tailwind.config.js` (matte black, graphite, warm white, electric orange, muted grey).

## Demo mode (what is NOT connected yet)

- **Auth, favorites, downloads, designs, reviews, uploads** are stored in the browser only. Connect Supabase (Auth + Postgres + Storage) to persist them.
- **Payments**: no provider is connected. Premium "purchases" are demo orders that charge nothing and collect no card data. Connect Stripe/Razorpay before selling.
- **Downloads** deliver a manifest + license text, not the real asset files. Upload the real files to storage and serve signed URLs.
- **Ratings, review counts, download counts, follower and like counts** are intentionally empty: no real data exists, so none is shown.
- **Listings, creators, prices and imagery** are sample data. Photos are stock imagery; replace with licensed or creator-supplied previews.
- Moderation workflow in `/admin` operates on local data only.
