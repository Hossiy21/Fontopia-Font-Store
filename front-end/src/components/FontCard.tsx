import { Heart, Download, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FontDetailsModal } from "./FontDetailsModal";
import { useLazyFontLoad } from "@/hooks/useLazyFontLoad";

interface FontCardProps {
  name: string;
  previewText: string;
  onFavoriteToggle: (name: string) => void;
  onDownload: () => void;
  fontSize?: number;
  author?: string;
  size?: string;
}

export const FontCard = ({
  name,
  previewText,
  onFavoriteToggle,
  onDownload,
  fontSize = 24,
  author,
  size,
}: FontCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const displayName = name.replace(/\.(ttf|otf)$/i, "");

  // Lazy load font when card becomes visible
  const { ref, isLoaded, isLoading } = useLazyFontLoad({
    id: 0,
    name,
    size: size || "0",
    author: author || "Unknown",
  });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavoriteToggle(name);
    toast(isFavorite ? "Removed from favorites" : "Added to favorites", {
      description: `Font: ${displayName}`,
    });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload();
  };

  const handleShowDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(true);
  };

  return (
    <>
      <div ref={ref} className="group font-card animate-fade-in cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 p-4 sm:p-5 bg-gradient-to-br from-card via-card to-card/95 border-2 border-border/50 hover:border-primary/30 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3
            className="text-base sm:text-lg font-bold truncate bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all"
            style={{ fontFamily: isLoaded ? `"${displayName}"` : "sans-serif" }}
          >
            {displayName}
          </h3>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={handleDownload}
              className="icon-button hover:bg-green-500/10 hover:text-green-500"
              aria-label="Download font"
              title="Download"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5 transition-all" />
            </button>
            <button
              onClick={toggleFavorite}
              className="icon-button hover:bg-pink-500/10"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart
                className={`h-4 w-4 sm:h-5 sm:w-5 transition-all ${
                  isFavorite ? "fill-pink-500 text-pink-500 scale-110" : "hover:text-pink-500 hover:scale-110"
                }`}
              />
            </button>
            <button
              onClick={handleShowDetails}
              className="icon-button hover:bg-blue-500/10 hover:text-blue-500"
              aria-label="Show font details"
              title="Font Info"
            >
              <Info className="h-4 w-4 sm:h-5 sm:w-5 transition-all" />
            </button>
          </div>
        </div>
        <div
          className="font-preview text-sm sm:text-base overflow-hidden text-ellipsis whitespace-nowrap min-h-[60px] flex items-center justify-center bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-lg px-3 py-4 border border-border/30"
          style={{
            fontFamily: isLoaded ? `"${displayName}"` : "sans-serif",
            fontSize: `${fontSize > 20 ? fontSize * 0.8 : fontSize}px`,
            opacity: isLoading ? 0.5 : 1,
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {isLoading ? (
            <span className="text-muted-foreground text-xs animate-pulse">Loading font...</span>
          ) : (
            previewText || <span className="text-muted-foreground/50 text-xs">Type to preview</span>
          )}
        </div>
        {isLoaded && (
          <div className="flex items-center justify-end mt-3 text-xs text-muted-foreground">
            <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-[10px] font-medium">
              Loaded
            </span>
          </div>
        )}
      </div>
      <FontDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        font={{ id: 1, name: displayName, size: size || "Unknown", author: author || "Unknown" }}
        previewText={previewText}
        fontSize={fontSize}
        onFavoriteToggle={onFavoriteToggle}
        isFavorite={isFavorite}
      />
    </>
  );
};