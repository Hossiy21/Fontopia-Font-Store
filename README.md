# Fontopia — Free Amharic Fonts (v1)

Live demo: https://lnkd.in/dat_SeXt

A modern web app for browsing, previewing, and downloading 200+ Amharic & Ethiopian fonts. Fontopia makes it easy for designers, content creators, and developers to explore Amharic typography—preview fonts in real-time, batch-download selections as ZIPs, and integrate fonts into projects quickly.

Built with a modern full‑stack toolchain and focused on performance, accessibility, and crediting the original font creators.

---

## Table of Contents

- About
- Demo
- Key Features
- Tech Stack
- Architecture & Data Flow
- Getting Started (Local)
  - Frontend
  - Backend
  - Running Both Locally
- Deployment Notes
- Contributing
- Credits & Licensing
- Contact

---

## About

Fontopia aggregates Amharic/Ethiopian fonts and provides an intuitive interface to search, preview, and download them. It was built to make fonts accessible to the Ethiopian tech & creative community while preserving credit to font authors.

---

## Demo

Try the live demo: https://lnkd.in/dat_SeXt

---

## Key Features

- Real-time search & filtering (by style, weight, license, etc.)
- Instant preview with customizable sample text (supports Ge'ez script)
- Batch downloads: select multiple fonts and download as a ZIP
- Dark mode support
- Lazy loading & performance optimizations for fast browsing
- Fully responsive (mobile, tablet, desktop)
- Proper credits and attribution for original font creators

---

## Tech Stack

- Frontend: React 18, TypeScript, Vite
- UI: shadcn/ui + Tailwind CSS
- State / Data fetching: TanStack Query (React Query)
- Backend: Go (Golang) — serves API endpoints (font metadata, search, ZIP bundling)
- Deployment: Vercel (frontend) + Render (backend)
- Other: ZIP generation for batch download, image thumbnails, caching layers

---

## Architecture & Data Flow

1. Frontend (React + TanStack Query) fetches font metadata and thumbnails from the Go backend.
2. Search and filtering run server-side and client-side caching is handled by TanStack Query.
3. On batch download, the frontend sends the selected font IDs to the backend; the Go service streams or builds a ZIP and returns it.
4. Thumbnails are lazily loaded and cached for performance; fonts are stored in object storage (or in-repo assets for v1).

---

## Getting Started (Local development)

> These are general instructions — adapt to your environment and package manager (npm / pnpm / yarn).

Prerequisites:
- Node.js >= 18
- Go >= 1.20
- Git

Clone the repo:
```bash
git clone https://github.com/<owner>/<repo>.git
cd <repo>
```

### Frontend (React + Vite)

1. Enter the frontend directory (if applicable):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn
```

3. Create environment file
- Copy `.env.example` to `.env` and set API_BASE_URL to your local backend (e.g. http://localhost:8080/api).

4. Run dev server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

5. Build for production:
```bash
npm run build
# or
pnpm build
```

6. Preview production build:
```bash
npm run preview
# or
pnpm preview
```

### Backend (Go)

1. Enter the backend directory:
```bash
cd backend
```

2. Create env file:
- Copy `.env.example` to `.env` and configure any required variables like STORAGE_PATH, PORT, or ZIP_TEMP_DIR.

3. Run locally:
```bash
go run ./cmd/server
# or (build + run)
go build -o fontopia-server ./cmd/server
./fontopia-server
```

4. Common endpoints (example):
- GET /api/fonts — list fonts, pagination & filters
- GET /api/fonts/:id — font metadata
- POST /api/zip — create batch download (body: list of font IDs)

(See backend README or docs for full API contract)

### Running Both Locally

- Start backend (default port 8080)
- Start frontend (Vite dev server) and point API_BASE_URL to backend
- Use TanStack Query devtools if helpful

---

## Deployment Notes

- Frontend: deploy the built static site to Vercel. Set environment variable API_BASE_URL to your backend URL (the Render instance).
- Backend: deploy the Go service to Render (or any container provider). Ensure:
  - Large file handling for ZIP generation
  - Proper storage for font files (S3 / object storage recommended for scale)
  - CORS configured for your frontend domain

CI/CD:
- Frontend: Vercel auto-deploys on push to main
- Backend: Render or GitHub Actions for Docker image build + deploy

---

## Contributing

Contributions, issues, and feature requests are welcome!

Suggested workflow:
1. Fork the repository
2. Create a branch: feat/your-feature or fix/your-fix
3. Make changes and add tests where appropriate
4. Open a pull request describing the change and why it's needed

Please include font license details when adding new fonts and ensure you credit the original font creator in metadata.

---

## Credits & Licensing

- Fonts: Credit is given to each original font creator and is shown on the font detail page. Ensure you review the license of each font before redistribution.
- UI: shadcn/ui, Tailwind CSS
- State: TanStack Query

License: MIT (or choose the license you prefer — update LICENSE file accordingly)

If your project includes fonts with restrictive licenses, do not redistribute them; instead, link to the original source and show previews only.

---

## Accessibility & Internationalization

- The UI supports Ge'ez script rendering in previews
- Considerations made for color contrast and keyboard accessibility
- Future: add language/localization support for Amharic interface strings

---

## Contact

Built by: Hossiy (Hossiy21)  
Twitter / Dev diary: @Hossiy_DevDiary

I'd love feedback and suggestions — open an issue or reach out on Twitter.

---

Thanks for checking out Fontopia! 🎉
