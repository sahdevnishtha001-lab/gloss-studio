# GLOSS Studio

GLOSS is a portfolio builder for models, makeup artists, hairstylists, and hotel professionals. A single draft produces a living portfolio with photos and video and a classic résumé that can be printed or saved as a PDF.

[Open the live GLOSS website](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/) · [Explore the sample portfolios](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/#studio-samples)

## Try the project

- **Model.** Play the introduction and runway videos, view the casting Polaroids, and filter the shoot gallery. [Model sample](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/samples/model)
- **Beauty.** Browse role-specific looks, video demonstrations, and classic résumés. [Makeup sample](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/samples/makeup) · [Hair sample](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/samples/hair)
- **Hotel management.** Explore kitchen projects, guest-service scenarios, and hotel operations checklists. [Chef sample](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/samples/chef) · [Receptionist sample](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/samples/receptionist) · [Hotel staff sample](https://gloss-studio-editorial.sahdev-nishtha001.chatgpt.site/samples/staff)

The samples open without signing in. Use **Build portfolio** on the live site to try the editor with a ChatGPT account. The sample profiles are fictional. The model page credits its stock runway demonstration.

## How it works

- **Portfolio editor.** Separate drafts for each profession, custom collections, image and video uploads, featured work, category filters, and browser-local storage with IndexedDB.
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
