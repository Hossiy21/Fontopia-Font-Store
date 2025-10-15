
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const ethiopianDate = new Intl.DateTimeFormat('am-ET', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'ethiopic'
  }).format(currentTime);

  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="container py-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fontopia. {ethiopianDate}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by <a href="https://t.me/Hossiy_DevDiary" target="_blank">Hosaina Y.</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
