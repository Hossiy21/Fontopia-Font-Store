import { Input } from "@/components/ui/input";
import { Type } from "lucide-react";

interface TextInputProps {
  onChange: (text: string) => void;
}

export const TextInput = ({ onChange }: TextInputProps) => {
  return (
    <div className="mb-8 max-w-2xl mx-auto">
      <label htmlFor="preview-text" className="block text-sm font-semibold mb-3 text-foreground/80">
        Preview Text
      </label>
      <div className="relative">
        <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id="preview-text"
          type="text"
          placeholder="Type text to preview fonts in real-time..."
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 h-12 text-base border-2 focus:border-primary/50 rounded-xl shadow-sm"
        />
      </div>
    </div>
  );
};
