# groq chat widget

an embeddable ai chatbot widget for business websites.

## what is included

- `public/widget.js` injects the floating chat bubble and dark chat window
- `app/api/chat/route.ts` sends messages to groq and keeps your api key server-side
- `BUSINESS_CONTEXT` lives at the top of `app/api/chat/route.ts` so you can swap client info fast

## local setup

1. install dependencies:
   `npm install`
2. copy `.env.example` to `.env.local`
3. add your groq key:
   `GROQ_API_KEY=...`
4. start the app:
   `npm run dev`

## customize the business info

edit the `BUSINESS_CONTEXT` constant in `app/api/chat/route.ts`.

that text is the source of truth for what the assistant knows about the business.

## embed on any website

after deployment, paste this before the closing `</body>` tag on the client site:

```html
<script
  src="https://your-domain.vercel.app/widget.js"
  data-title="Talk to Acme Studio"
  data-subtitle="Ask about services, pricing, or timelines."
  defer
></script>
```

### optional script attributes

- `data-api-base` if you want the widget to call a different deployed backend
- `data-title` to change the chat header
- `data-subtitle` to change the helper text
- `data-accent` to change the focus outline color

## deploy to vercel

1. push this repo to github
2. create a new vercel project from the repo
3. add `GROQ_API_KEY` in project settings
4. deploy
5. copy the production url and use it in the script tag

## notes

- the chat route allows cross-origin requests so the widget can run on other websites
- the groq key never ships to the browser
- if you need per-client behavior, duplicate the project or make `BUSINESS_CONTEXT` client-specific on the server
