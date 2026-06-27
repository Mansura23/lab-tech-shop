# TechCart Premium Implementation Notes

**Live URL:** https://lab-tech-shop-snowy.vercel.app/

## Storage Approach
I chose **localStorage** over sessionStorage because the requirement is that the premium status must survive page refreshes and even tab closures. localStorage persists until explicitly cleared, which perfectly matches the "pay once, remember forever" use case. The key used is `techcart-premium`.

## Server vs Client Components
- **Server Components** (no `'use client'`): `layout.js`, `page.js` (home page), `data/products.js`. These components only render static data and have no interactivity. They run on the server, which improves performance and SEO.
- **Client Components** (with `'use client'`): `app/premium/page.js`, `app/components/AdBanner.js`, `app/components/Navbar.js`. All of these need to read from or write to `localStorage`, which is browser‑only. Making them client components is mandatory. This separation keeps the overall app fast while enabling dynamic, stateful behavior where it is truly needed.

## First‑Render / Hydration Strategy
To avoid hydration mismatches between the server and the client, I used a `mounted` flag (`useState` + `useEffect`) in every component that reads `localStorage`. Initially, `isPremium` is set to `null` and the component renders nothing (or a neutral placeholder). After the component mounts, the flag triggers a re‑read of storage and updates the state accordingly. This ensures that the server‑rendered HTML always matches the first client render, preventing React hydration warnings.

## What I Would Add with One More Hour
- Implement a proper Luhn algorithm check for the card number to validate it more realistically.
- Add support for multiple subscription plans (monthly / lifetime) and store the chosen plan.
- Use `usePathname` from Next.js to highlight the active link in the navbar.
- Persist a timestamp of the purchase and optionally implement an expiry mechanism for monthly plans.
- Improve the "Cancel Premium" experience by adding a dedicated button in the navbar (not just on the premium page).

## Deployment
The app is deployed on Vercel using the default settings. The remote image host (Unsplash) is already whitelisted in `next.config.mjs`, so product images load correctly both locally and in production.
