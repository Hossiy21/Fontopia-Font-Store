/**
 * Centralized API client for Fontopia
 * Handles all backend communication with proper error handling
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082";

export interface Font {
  id: number;
  name: string;
  size: string;
  author: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: `API Error: ${response.statusText}`,
        status: response.status,
      };
      throw error;
    }
    return response.json();
  }

  async getFonts(): Promise<Font[]> {
    const response = await fetch(`${this.baseUrl}/api/fonts`);
    return this.handleResponse<Font[]>(response);
  }

  async downloadFont(fontName: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/fonts/download/${fontName}`);
    if (!response.ok) {
      throw new Error(`Failed to download font: ${response.statusText}`);
    }
    return response.blob();
  }

  getFontUrl(fontName: string): string {
    return `${this.baseUrl}/fonts/${fontName}`;
  }
}

export const apiClient = new ApiClient(API_URL);
export { API_URL };
