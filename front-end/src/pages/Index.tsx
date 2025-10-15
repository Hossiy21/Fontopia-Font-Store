import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { FontCard } from "@/components/FontCard";
import { TextInput } from "@/components/TextInput";
import { Slider } from "@/components/ui/slider";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { saveAs } from "file-saver";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Sparkles } from "lucide-react";

interface Font {
  id: number;
  name: string;
  size: string;
  author: string;
}

const Index = () => {
  const [previewText, setPreviewText] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]); // No localStorage persistence
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"a-z" | "z-a" | "size">("a-z");
  const [fonts, setFonts] = useState<Font[]>([]);
  const [fontSize, setFontSize] = useState(24);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFonts();
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

  const fetchFonts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/fonts`);
      if (!response.ok) {
        throw new Error(`Failed to fetch fonts: ${response.statusText}`);
      }
      const data = await response.json();
      setFonts(data);
      setLoading(false);
      // Fonts will be loaded lazily when cards appear in viewport
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to load fonts: " + err.message);
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (fontName: string) => {
    setFavorites((prev) =>
      prev.includes(fontName)
        ? prev.filter((name) => name !== fontName)
        : [...prev, fontName]
    );
  };

  const handleDownload = useCallback(
    async (fontId: number) => {
      const font = fonts.find((f) => f.id === fontId);
      if (font) {
        try {
          const response = await fetch(`${API_URL}/api/fonts/download/${font.name}`);
          if (!response.ok) {
            throw new Error("Download failed");
          }
          const blob = await response.blob();
          saveAs(blob, font.name);
          toast.success("Font downloaded successfully", {
            description: `Font: ${font.name}`,
          });
        } catch (error: any) {
          toast.error("Failed to download font");
        }
      }
    },
    [fonts, API_URL]
  );

  const sortFonts = (fonts: Font[]) => {
    return [...fonts].sort((a, b) => {
      const nameA = a.name.replace(/\.(ttf|otf)$/i, "");
      const nameB = b.name.replace(/\.(ttf|otf)$/i, "");
      switch (sortBy) {
        case "a-z":
          return nameA.localeCompare(nameB);
        case "z-a":
          return nameB.localeCompare(nameA);
        case "size":
          return parseFloat(b.size) - parseFloat(a.size);
        default:
          return 0;
      }
    });
  };

  const filteredAndSortedFonts = sortFonts(
    fonts.filter((font) =>
      font.name.toLowerCase().replace(/\.(ttf|otf)$/i, "").includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          totalFonts={0}
        />
        <main className="container py-8 flex-1">
          <div className="mb-8 text-center space-y-2">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="mb-6">
            <Skeleton className="h-12 w-full max-w-2xl mx-auto" />
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
        totalFonts={fonts.length}
      />
      <main className="container py-8 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-8 space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
              Discover Amharic Fonts
            </h1>
            <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Browse and download from our collection of {fonts.length}+ beautiful Ethiopian fonts
          </p>
        </div>
        <TextInput onChange={setPreviewText} />
        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm font-medium">Font Size: {fontSize}px</span>
          <div className="flex-1 max-w-xs">
            <Slider
              value={[fontSize]}
              onValueChange={([value]) => setFontSize(value)}
              min={12}
              max={72}
              step={1}
              className="w-full"
            />
          </div>
        </div>
        <SearchBar
          onSearch={setSearchQuery}
          onSort={setSortBy}
          fonts={fonts.map((f) => f.name.replace(/\.(ttf|otf)$/i, ""))}
        />
        {filteredAndSortedFonts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative">
              <Search className="h-24 w-24 text-muted-foreground/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">No fonts found</h3>
            <p className="mt-2 text-muted-foreground text-center max-w-sm">
              {searchQuery
                ? `No fonts match "${searchQuery}". Try a different search term.`
                : "Start typing to search for fonts."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedFonts.map((font) => (
              <FontCard
                key={font.id}
                name={font.name}
                previewText={previewText}
                onFavoriteToggle={handleFavoriteToggle}
                onDownload={() => handleDownload(font.id)}
                fontSize={fontSize}
                author={font.author}
                size={font.size}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
