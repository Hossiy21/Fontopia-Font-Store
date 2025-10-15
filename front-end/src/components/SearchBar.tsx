import { Search } from "lucide-react";
import { useState } from "react";

type SortOption = "a-z" | "z-a" | "size";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSort: (option: SortOption) => void;
  fonts: string[];
}

export const SearchBar = ({ onSearch, onSort, fonts }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("a-z");

  const filteredFonts = fonts
    .filter((font) => font.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
    setShowSuggestions(query.length > 0);
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    onSort(option);
  };

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search fonts..."
              className="h-11 w-full rounded-full border border-input bg-background pl-10 pr-4 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSuggestions(searchQuery.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </div>
          {showSuggestions && filteredFonts.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg overflow-hidden">
              {filteredFonts.map((font) => (
                <button
                  key={font}
                  className="w-full px-4 py-2.5 text-left hover:bg-secondary/80 transition-colors"
                  onClick={() => handleSearch(font)}
                >
                  {font}
                </button>
              ))}
            </div>
          )}
        </div>
        <select
          className="h-11 rounded-lg border bg-background px-4 text-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
        >
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
          <option value="size">Size</option>
        </select>
      </div>
    </div>
  );
};