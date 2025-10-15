import { X, Download } from "lucide-react";
import { toast } from "sonner";

const VERSION = "FavoritesModal-v2.3";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  onDownload: (fonts: string[]) => void;
}

export const FavoritesModal = ({ isOpen, onClose, favorites, onDownload }: FavoritesModalProps) => {
  console.log(`${VERSION}: Rendered with props:`, { isOpen, onClose, favorites, onDownload });
  console.log(`${VERSION}: onDownload type:`, typeof onDownload);

  if (!isOpen) return null;

  const handleBatchDownload = () => {
    console.log(`${VERSION}: handleBatchDownload called with favorites:`, favorites);
    if (typeof onDownload !== "function") {
      console.error(`${VERSION}: onDownload is not a function:`, onDownload);
      toast.error("Batch download feature is unavailable");
      return;
    }
    onDownload(favorites);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Favorite Fonts</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close favorites modal"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {favorites.length === 0 ? (
          <p className="text-muted-foreground">No favorite fonts yet</p>
        ) : (
          <>
            <div className="max-h-[60vh] overflow-auto">
              <div className="space-y-2">
                {favorites.map((font) => (
                  <div key={font} className="flex items-center justify-between rounded-md border p-3">
                   <span className="font-medium">{font.replace(/\.(ttf|otf)$/i, "")}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleBatchDownload}
              className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              title={`Download ${favorites.length > 1 ? "all favorite fonts" : "font"}`}
            >
              <Download className="h-4 w-4" />
              Download All ({favorites.length})
            </button>
          </>
        )}
      </div>
    </div>
  );
};