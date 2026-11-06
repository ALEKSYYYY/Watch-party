# Movie Night

Watch movies together in sync — local files, direct video links, or share any website link with the room.

## Features

- **Video tab**
  - Pick the same movie file on each device (uses no data)
  - Or paste a direct `.mp4` / `.webm` link
  - Play, pause and seeking stay in sync for everyone

- **Website tab**
  - Paste any website link (YouTube, articles, etc.)
  - Everyone in the room gets the same link
  - If the site allows embedding it appears in the page
  - If the site blocks embedding (most video platforms), a big “Open this link” button is shown so everyone can open the exact same page

- Live chat in the room
- Works as a Progressive Web App (can be installed on phones)

## Deploy on Render (free)

1. Push this folder to a GitHub repository.
2. Go to [render.com](https://render.com) → New → Web Service.
3. Connect the repo.
4. Settings:
   - **Runtime**: Node
   - **Build Command**: (leave empty)
   - **Start Command**: `node server.js`
5. Create the service. Render will give you a URL.

## Run locally

```bash
node server.js
```

Then open http://localhost:3000

## Notes

- True synchronized control of YouTube/Netflix/etc. is not possible without a browser extension (sites block it).
- Direct video files and local files sync perfectly.
- Website mode is best used as a shared “everyone open this” + chat experience.
