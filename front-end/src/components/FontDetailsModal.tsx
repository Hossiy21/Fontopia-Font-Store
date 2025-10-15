import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, FileCheck } from "lucide-react";
import { useState } from "react";

interface FontDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  font: {
    id: number;
    name: string; // displayName (without .ttf)
    size: string;
    author?: string;
  };
  previewText: string;
  fontSize: number;
  onFavoriteToggle: (name: string) => void;
  isFavorite: boolean;
}

export const FontDetailsModal = ({
  isOpen,
  onClose,
  font,
  previewText,
  fontSize,
  onFavoriteToggle,
  isFavorite,
}: FontDetailsModalProps) => {
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const license = "Free for personal and commercial use";

  const colors = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#808080",
    "#FFA500",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{font.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Text Color</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={`text-${color}`}
                      onClick={() => setTextColor(color)}
                      className={`w-6 h-6 rounded-full border border-gray-300 ${
                        textColor === color ? "ring-2 ring-primary ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Set text color to ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Background Color</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={`bg-${color}`}
                      onClick={() => setBackgroundColor(color)}
                      className={`w-6 h-6 rounded-full border border-gray-300 ${
                        backgroundColor === color ? "ring-2 ring-primary ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Set background color to ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div
              className="min-h-[100px] p-4 border rounded-lg transition-colors"
              style={{
                fontFamily: `"${font.name}"`, // Use displayName (base name)
                fontSize: `${fontSize}px`,
                color: textColor,
                backgroundColor: backgroundColor,
              }}
            >
              {previewText || " "} {/* Amharic: "Hello World" */}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-muted-foreground" />
              <span>{license}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />Made By :
              <span>{font.author || "Unknown Author"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Size: {font.size} MB</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};