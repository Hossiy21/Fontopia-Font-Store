import { Moon, Sun, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { FavoritesModal } from "./FavoritesModal";

interface HeaderProps {
  favorites: string[];
  onFavoriteToggle: (fontName: string) => void;
  totalFonts: number;
}

export const Header = ({ favorites, onFavoriteToggle, totalFonts }: HeaderProps) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("isDark");
    return saved ? JSON.parse(saved) : false;
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("isDark", JSON.stringify(isDark));
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleBatchDownload = async (favoriteNames: string[]) => {
    if (!favoriteNames.length) {
      toast.error("No favorite fonts selected for download");
      return;
    }
    const zip = new JSZip();
    try {
      for (const fontName of favoriteNames) {
        const response = await fetch(`${API_URL}/api/fonts/download/${fontName}`);
        if (!response.ok) continue;
        const blob = await response.blob();
        zip.file(fontName, blob);
      }
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "favorite-fonts.zip");
      toast.success("Favorite fonts downloaded successfully as ZIP");
    } catch (error: any) {
      toast.error(`Error downloading favorite fonts: ${error.message}`);
    }
  };


  const amharicDays = ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙሸ", "አርብ", "ቅዳሜ"];
  const currentDay = amharicDays[currentTime.getDay()];

  const ethiopianDateParts = new Intl.DateTimeFormat("am-ET", {
    year: "numeric",
    month: "long",
    day: "numeric",
    calendar: "ethiopic",
  })
    .formatToParts(currentTime)
    .reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {} as Record<string, string>);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");
  const isAM = hours < 12;
  const formattedHours = ((hours % 12) || 12).toString().padStart(2, "0");
  const amPm = isAM ? "ጥዋት" : "ከሰዓት";
  const formattedTime = `${formattedHours}:${minutes}:${seconds} ${amPm} GMT+3`;
  const formattedDateTime = `${currentDay}፣ ${ethiopianDateParts.month} ${ethiopianDateParts.day}, ${ethiopianDateParts.year}, ${formattedTime}`;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl backdrop-blur-md border-b border-gray-700/50">
        <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
                Fontopia
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
                Free
              </span>
            </div>

            {/* Date and Font Count - Hidden on very small screens */}
            <div className="hidden sm:block text-sm md:text-base text-gray-300 tracking-wide text-center">
              <span className="font-semibold text-white">{formattedDateTime}</span> •
              <span className="font-semibold text-white"> Total Fonts: {totalFonts}</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className="group relative p-2 sm:p-2.5 bg-gradient-to-br from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30 text-white rounded-xl transition-all duration-300 border border-pink-500/30 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105"
                onClick={() => setShowFavorites(true)}
                title="View favorite fonts"
              >
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 group-hover:fill-pink-400 transition-all" />
                {favorites.length > 0 && (
                  <span className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xs font-bold shadow-lg animate-pulse">
                    {favorites.length}
                  </span>
                )}
              </button>
              <button
                className="group p-2 sm:p-2.5 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 text-white rounded-xl transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105"
                onClick={toggleTheme}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun className="h-5 w-5 sm:h-6 sm:w-6 group-hover:text-yellow-300 transition-colors" /> : <Moon className="h-5 w-5 sm:h-6 sm:w-6 group-hover:text-blue-300 transition-colors" />}
              </button>
            </div>
          </div>

          {/* Mobile Date Display */}
          <div className="sm:hidden text-xs text-gray-300 tracking-wide text-center mt-2">
            <span className="font-semibold text-white">{formattedDateTime}</span> •
            <span className="font-semibold text-white"> Fonts: {totalFonts}</span>
          </div>
        </div>
      </header>
      <FavoritesModal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        favorites={favorites}
        onDownload={handleBatchDownload}
      />
    </>
  );
};