# Fontopia - Free Amharic Fonts

Modern React application for browsing and downloading Amharic and Ethiopian fonts with lazy loading and optimized performance.

## 🚀 Features

- **Lazy Font Loading**: Fonts load only when cards appear in viewport using IntersectionObserver
- **200+ Fonts**: Extensive collection of Amharic and Ethiopian fonts
- **Search & Filter**: Real-time search with multiple sorting options (A-Z, size, downloads)
- **Batch Download**: Download all fonts or favorites as ZIP
- **Dark Mode**: Persistent theme switching
- **Ethiopian Calendar**: Real-time display with Amharic localization
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Meta tags, JSON-LD schema, robots.txt, sitemap.xml

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to frontend directory
cd front-end

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8082
```

## 📜 Available Scripts

```sh
npm run dev          # Start development server (port 8080)
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🏗️ Project Structure

```
front-end/
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   ├── robots.txt
│   ├── sitemap.xml
│   └── manifest.webmanifest
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── FontCard.tsx     # Lazy-loading font card
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── useLazyFontLoad.ts  # IntersectionObserver hook
│   ├── pages/
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env
├── .env.example
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🎯 Performance Optimizations

- ✅ Lazy font loading with IntersectionObserver
- ✅ React Query for API caching and state management
- ✅ Environment-based configuration
- ✅ Removed blocking third-party scripts
- ✅ Optimized bundle with Vite
- ✅ PWA-ready with manifest

## 🔍 SEO Features

- Meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Twitter Card tags
- JSON-LD structured data
- Canonical URLs
- robots.txt
- sitemap.xml
- Semantic HTML

## 🌐 Backend API

The frontend connects to a Go backend serving fonts:

- `GET /api/fonts` - List all fonts
- `GET /api/fonts/download/:name` - Download specific font
- `GET /fonts/:name` - Stream font file for preview

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Font authors and contributors
- shadcn/ui for component library
- Radix UI for accessible primitives
