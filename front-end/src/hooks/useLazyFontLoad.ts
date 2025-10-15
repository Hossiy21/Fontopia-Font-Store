import { useEffect, useRef, useState } from "react";

interface Font {
  id: number;
  name: string;
  size: string;
  author: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

// Track which fonts have been loaded globally to avoid duplicate loads
const loadedFonts = new Set<string>();
const loadingFonts = new Map<string, Promise<void>>();

/**
 * Custom hook to lazy-load a font when the element becomes visible
 * Uses IntersectionObserver to detect when the card enters the viewport
 */
export const useLazyFontLoad = (font: Font) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const baseName = font.name.replace(/\.(ttf|otf)$/i, "");

    // If already loaded, mark as loaded immediately
    if (loadedFonts.has(baseName)) {
      setIsLoaded(true);
      return;
    }

    // If currently loading, wait for it
    if (loadingFonts.has(baseName)) {
      setIsLoading(true);
      loadingFonts.get(baseName)!.then(() => {
        setIsLoaded(true);
        setIsLoading(false);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadedFonts.has(baseName)) {
            setIsLoading(true);

            // Create a promise for this font load
            const loadPromise = (async () => {
              try {
                const fontFace = new FontFace(
                  baseName,
                  `url(${API_URL}/fonts/${font.name})`
                );
                await fontFace.load();
                document.fonts.add(fontFace);
                loadedFonts.add(baseName);
                setIsLoaded(true);
              } catch (err) {
                console.warn(`Failed to load font ${font.name}:`, err);
              } finally {
                setIsLoading(false);
                loadingFonts.delete(baseName);
              }
            })();

            loadingFonts.set(baseName, loadPromise);
            observer.unobserve(element);
          }
        });
      },
      {
        rootMargin: "50px", // Start loading slightly before the element is visible
        threshold: 0.01,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [font.name]);

  return { ref, isLoaded, isLoading };
};
