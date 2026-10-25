# Sparks Academy website

The one-page website for **Sparks Academy** plus the **Join Sparks Today** registration form.

- **Homepage** (`/`): hero, scrolling cards, vision, programs, schedule & tuition, comparison, FAQ.
- **Registration** (`/join`): dynamic form (1–4 children), policies with e-signatures.
- **Thank-you page** (`/join/thanks`).

Built with Astro 6, Tailwind CSS v4 and Cloudflare Workers. Pages are pre-built static HTML, so they load fast. Only the form submission (`/api/register`) runs code on Cloudflare: it checks for spam, emails you, and saves each registration to a Cloudflare D1 database.

---

## Editing the website

You can do all of these on github.com in your browser: open the file, click the pencil icon, edit, and **Commit changes**. The site rebuilds and goes live in about a minute.

| To change… | Edit this file |
|---|---|
| Any homepage text: headline, cards, programs, prices, FAQ, comparison | `src/data/site.ts` |
| Registration form text and policies | `src/data/registration.ts` |
| Colors and fonts | `src/styles/global.css` (the `@theme` block at the top) |
| Where sign-up emails go | `wrangler.jsonc` → `NOTIFY_EMAIL` (comma-separate several addresses) |

Rules for editing `site.ts` and `registration.ts`:
- Only change the words **inside the quotes**.
- Keep the commas, brackets and quotes.
- If your text needs a double quote, use curly quotes (“ ”).

**Policies:** if you change wording that parents agree to, also update `POLICY_VERSION` in `src/data/registration.ts` (for example to today's date). Every registration records the version it was signed under.

### Adding photos
- **Hero photo:** save a photo as `src/assets/hero.jpg` and it replaces the illustration automatically. It is resized and compressed for you. Describe it in `hero.photoAlt` in `site.ts`.
- **Other photos:** put them in `src/assets/` and ask your developer (or Claude) where to place them.

---

## One-time setup (about 30–45 minutes)

### 1. Put the code on GitHub
Upload this folder to **github.com/arman999/sparks-academy-website**.

### 2. Create the registration database
1. Cloudflare dashboard → **Storage & Databases → D1 SQL Database → Create**. Name it `sparks-registrations`.
2. Copy its **Database ID** into `wrangler.jsonc`, replacing `PASTE-YOUR-D1-DATABASE-ID-HERE`.
3. Open the database → **Console**, paste the contents of `migrations/0001_create_registrations.sql`, and run it. This creates the table.

### 3. Connect GitHub to Cloudflare (automatic deploys)
1. Cloudflare dashboard → **Workers & Pages → Create → Import a repository**. Choose `sparks-academy-website`.
2. Set these build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
3. Deploy. From now on, every change pushed to GitHub goes live automatically, and other branches get preview links.

### 4. Turn on spam protection (Cloudflare Turnstile)
1. Cloudflare dashboard → **Turnstile → Add widget**. Add hostname `sparksacademyenrichment.com` and use mode **Managed**.
2. Copy the **Site Key**. In your Worker → **Settings → Build → Variables and secrets**, add `PUBLIC_TURNSTILE_SITE_KEY` = your site key.
3. Copy the **Secret Key**. In your Worker → **Settings → Variables and Secrets**, add a **Secret** named `TURNSTILE_SECRET_KEY`.
4. Redeploy.

Until you finish this step, the form uses Cloudflare's test key and has no spam protection. It still works.

### 5. Turn on email notifications (Resend)
1. Create a free account at resend.com.
2. Go to **Domains → Add domain** and add `sparksacademyenrichment.com`. Resend can add the DNS records to Cloudflare for you; otherwise copy them into Cloudflare → DNS.
3. Create an **API key**. In your Worker → **Settings → Variables and Secrets**, add a **Secret** named `RESEND_API_KEY`.

After this, each registration:
- emails `agoshtas@gmail.com` with every answer (reply to the email to reach the parent directly), and
- sends the parent a "Welcome to the Sparks family!" copy of what they submitted. To turn this off, set `SEND_CONFIRMATION` to `"false"` in `wrangler.jsonc`.

### 6. Use your domain
Worker → **Settings → Domains & Routes → Add → Custom domain**. Add `sparksacademyenrichment.com`, then `www.sparksacademyenrichment.com`.

### 7. Test it
Submit a registration with your own details. Then check that:
- you received the notification email,
- the "welcome" email arrived, and
- the registration appears in the D1 database.

---

## Seeing registrations
- **Email:** each registration arrives at `NOTIFY_EMAIL` as soon as it's submitted.
- **Database:** Cloudflare dashboard → D1 → `sparks-registrations` → **Explore data**. The `data` column holds the full submission. If an email ever fails to send, the registration is still saved here.
- **From your computer:** `npm run db:list` shows the latest 50 registrations.

Registrations include children's names, birthdates and allergies. Turn on two-factor login for your Cloudflare, GitHub, Resend and Gmail accounts.

---

## Before launch: checklist
- [ ] Fill in `FACILITY_NAME` in `src/data/registration.ts`. It appears in the Release of Liability.
- [ ] Have the Release of Liability and policies reviewed by a lawyer, especially whether typed-name e-signatures are enough for a liability waiver.
- [ ] Add a hero photo (`src/assets/hero.jpg`) and any real photos of your program.
- [ ] Finish setup steps 2–6 and run the test in step 7.
- [ ] Replace the placeholder spark mark when your final brand mark is ready. Its shapes are in `src/lib/spark.ts`, the favicon is `public/favicon.svg`, and the share images are `public/og-image.png` and `public/apple-touch-icon.png`.

---

## For developers
```bash
npm install
cp .dev.vars.example .dev.vars   # local secrets (Turnstile test key)
npm run db:migrate:local         # create the local database
npm run dev                      # http://localhost:4321
npm run build                    # production build into dist/
npm run deploy                   # build + deploy with Wrangler (if not using GitHub deploys)
```

Project layout:
```
src/
  data/site.ts            all homepage content
  data/registration.ts    form text, policies, policy version
  data/icons.ts           inline Lucide icons
  components/             page sections (Hero, Marquee, Comparison, Faq, …) and form pieces
  layouts/Layout.astro    <head>, fonts, SEO tags
  lib/registration.ts     validation, Turnstile, Resend email, D1 save
  lib/spark.ts            geometry of the spark motif
  pages/index.astro       homepage
  pages/join/             registration + thank-you pages
  pages/api/register.ts   form endpoint (runs on Cloudflare)
  scripts/                small client scripts (form, marquee, sticky button, menu)
  styles/global.css       Tailwind + design tokens + motion
migrations/               D1 database schema
public/                   favicon, share image, robots.txt, sitemap.xml
```

Design tokens: ink `#0A0908`, paper `#FFFFFF`, mist `#F4F4F6`, brand blue `#1155CC`, spark yellow `#FFC600` (decoration only), action aqua `#1AE4C2` (Join buttons only, with dark text). Fonts: Bricolage Grotesque (headings) and Nunito (body), self-hosted through Astro's Fonts API.

Accessibility built in:
- The scrolling cards pause on hover, on keyboard focus, and with a pause button.
- All motion stops for visitors who turn on "reduce motion" on their device.
- Every form field is labeled.
- Form errors are announced and linked.
- The form works with JavaScript turned off.
