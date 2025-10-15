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

// CORS middleware to allow cross-origin requests
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		log.Printf("Handling %s %s", r.Method, r.URL.Path) // Debug log
		next.ServeHTTP(w, r)
	})
}

// Cache headers middleware for static assets
func addCacheHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Cache font files for 1 year (immutable)
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		next.ServeHTTP(w, r)
	})
}

// Get the list of fonts from fonts.json and send it as a response
func getFonts(w http.ResponseWriter, r *http.Request) {
	file, err := os.ReadFile("fonts.json")
	if err != nil {
		http.Error(w, "Failed to read font data", http.StatusInternalServerError)
		return
	}
	// Add caching headers for better performance
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "public, max-age=300") // 5 minutes
	w.Write(file)
}

// Download the requested font file from fontStore
func downloadFont(w http.ResponseWriter, r *http.Request) {
	fontName := r.URL.Path[len("/api/fonts/download/"):]
	if fontName == "" {
		http.Error(w, "Font name is required", http.StatusBadRequest)
		return
	}

	// Replace spaces with underscores in the font name for consistency
	fontName = strings.ReplaceAll(fontName, " ", "_")

	// Build the file path to the font file in the fontStore directory
	filePath := filepath.Join("fontStore", fontName)

	// Check if the font file exists in the fontStore directory
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		log.Printf("Font not found in fontStore: %s", fontName)
		http.Error(w, "Font file not found", http.StatusNotFound)
		return
	}

	// Set headers for downloading the file
	w.Header().Set("Content-Disposition", "attachment; filename="+fontName)
	w.Header().Set("Content-Type", "application/octet-stream")

	// Serve the font file to the client
	http.ServeFile(w, r, filePath)
}

func main() {
	mux := http.NewServeMux()

	// API Routes
	mux.HandleFunc("/api/fonts", getFonts)               // List fonts
	mux.HandleFunc("/api/fonts/download/", downloadFont) // Download font

	// Serve font files from the fontStore directory with caching
	fontHandler := http.StripPrefix("/fonts/", addCacheHeaders(http.FileServer(http.Dir("fontStore"))))
	mux.Handle("/fonts/", fontHandler)

	// Apply CORS middleware
	handler := corsMiddleware(mux)

	// Start the server
	log.Println("Server starting on :8082...")
	err := http.ListenAndServe(":8082", handler)
	if err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
