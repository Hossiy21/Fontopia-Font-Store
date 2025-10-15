package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type Font struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Author string `json:"author"`
	Size   string `json:"size"`
}

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Update to your frontend URL
		w.Header().Set("Access-Control-Allow-Origin", "https://fontopia-font-store.vercel.app")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Cache headers middleware
func addCacheHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		next.ServeHTTP(w, r)
	})
}

// List fonts
func getFonts(w http.ResponseWriter, r *http.Request) {
	file, err := os.ReadFile("fonts.json")
	if err != nil {
		http.Error(w, "Failed to read font data", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "public, max-age=300")
	w.Write(file)
}

// Download font
func downloadFont(w http.ResponseWriter, r *http.Request) {
	fontName := r.URL.Path[len("/api/fonts/download/"):]
	if fontName == "" {
		http.Error(w, "Font name is required", http.StatusBadRequest)
		return
	}
	fontName = strings.ReplaceAll(fontName, " ", "_")
	filePath := filepath.Join("fontStore", fontName)
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		http.Error(w, "Font file not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Disposition", "attachment; filename="+fontName)
	w.Header().Set("Content-Type", "application/octet-stream")
	http.ServeFile(w, r, filePath)
}

func main() {
	mux := http.NewServeMux()

	// Root route
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Fontopia Go Backend is running. Use /api/fonts or /api/fonts/download/{fontname}"))
	})

	// API routes
	mux.HandleFunc("/api/fonts", getFonts)
	mux.HandleFunc("/api/fonts/download/", downloadFont)

	// Serve font files
	fontHandler := http.StripPrefix("/fonts/", addCacheHeaders(http.FileServer(http.Dir("fontStore"))))
	mux.Handle("/fonts/", fontHandler)

	// Apply CORS
	handler := corsMiddleware(mux)

	// Get port from environment (Render requires this)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // fallback for local testing
	}

	log.Println("Server starting on port " + port + "...")
	err := http.ListenAndServe(":"+port, handler)
	if err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
