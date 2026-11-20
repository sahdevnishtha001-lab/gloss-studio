# GLOSS Studio

GLOSS is a portfolio builder for models, makeup artists, hairstylists, fashion designers and hotel professionals, with a dedicated agency workspace. A single draft produces a living portfolio with photos and video and a classic résumé that can be printed or saved as a PDF.

[Open the live GLOSS website](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/) · [Explore the sample portfolios](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/#studio-samples)

## Try the project

- **Model.** Play the introduction and runway videos, view the casting Polaroids, and filter the shoot gallery. [Model sample](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/samples/model)
- **Beauty.** Browse role-specific looks, video demonstrations, and classic résumés. [Makeup sample](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/samples/makeup) · [Hair sample](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/samples/hair)
- **Hotel management.** Explore kitchen projects, guest-service scenarios, and hotel operations checklists. [Chef sample](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/samples/chef) · [Receptionist sample](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/samples/receptionist) · [Hotel staff sample](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/samples/staff)

The samples open without signing in. Use **Build portfolio** on the live site to try the editor with a ChatGPT account. The sample profiles are fictional. The model page credits its stock runway demonstration.

## How it works

- **Portfolio editor.** A permanent profession per account, isolated device drafts, custom collections, image and video uploads, featured work, category filters, and browser-local storage with IndexedDB.
- **Export and publishing.** The editor exports self-contained HTML and a printable résumé. The hosted version can also publish a reviewed selection of work to a stable public URL and unpublish it from the editor.
- **Industry workflows.** The prototype includes an agency directory, an agency referral dashboard, a makeup artist directory, and webinar registration. Paid checkout, agency payouts, and third-party booking are future integrations.

## Run locally

Use Node.js 24. The preview uses the built-in Node SQLite module and has zero package installs.

```sh
node build-worker.mjs
node preview-worker.mjs
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173). The local preview provides a test sign-in identity, an isolated SQLite database, and file-based media storage. Rebuild and restart after editing the source.

## Source and checks

The frontend uses HTML, CSS, and JavaScript in `dist/`. The Worker entry point is `worker.mjs`. The hosted app uses D1 for records and R2 for media, with schema migrations in `drizzle/`.

```sh
node --test test-publishing.mjs test-network.mjs test-simple-network.mjs test-makeup-directory.mjs test-aviation.mjs
```

## Account and collaboration journey

Build portfolio opens the profession choices. GLOSS sign-up permanently fixes the account profession; only that profession’s editor and publishing permissions are available. The model studio offers a professional portfolio, location-based concept collaborations and agency affiliations.

Post a concept and the roles needed. Creatives send requests as their registered profession. The organiser approves one person per role; selected people appear in a private shoot studio with profile photos and a shared brief. Members can create referral links, including for photographers, to invite them to apply. The organiser finalises the completed team. Current concepts and requests appear on the user’s call sheet.

Models can send portfolio introductions to enrolled GLOSS agencies. An application is pending until the activated agency account approves it; only then does it appear under enrolled agencies. No production examples, agencies or user applications are seeded. Payments, payouts, chat and third-party bookings are not connected.

The new account and workflow migration is `drizzle/0004_talent_studio.sql`. Run `node test-talent-studio.mjs` for account locks, permissions, location filters, request approvals, team privacy, referrals and agency affiliations. Existing publication and network checks remain available.
