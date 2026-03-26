# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Contact Form (HQ API via Netlify Functions)

The contact page posts to `/api/contact`. In production, `netlify.toml` rewrites this path to the Netlify Function at `netlify/functions/contact.ts`, which validates the payload and forwards submissions to the HQ API.

Add these variables to an `.env` file in the project root:

```env
HQ_API_URL=https://your-hq-api-endpoint/api/v1/enquiries
HQ_APP_ID=your-app-id
HQ_APP_KEY=your-app-key
HQ_API_SECRET=your-api-secret
```

For local function testing, run the site through Netlify CLI (`netlify dev`) so `/api/contact` resolves to the Netlify Function.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
