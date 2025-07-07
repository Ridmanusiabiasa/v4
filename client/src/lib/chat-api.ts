import { ChatCompletionRequest, ChatCompletionResponse } from "@/types/chat";
import { apiRequest } from "./queryClient";

export class ChatAPI {
  static async sendMessage(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const response = await apiRequest("POST", "/api/chat/completions", request);
    return response.json();
  }

  static async loginAdmin(username: string, password: string): Promise<boolean> {
    try {
      console.log("Attempting admin login with:", { username, password: password ? "***" : "none" });
      
      const response = await apiRequest("POST", "/api/admin/login", {
        username,
        password
      });
      
      console.log("Login response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        return true;
      } else {
        const errorData = await response.text();
        console.log("Login failed:", errorData);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  static async getTokenUsage() {
    const response = await apiRequest("GET", "/api/admin/token-usage");
    return response.json();
  }

  static async addApiKey(key: string) {
    const response = await apiRequest("POST", "/api/admin/api-keys", { key });
    return response.json();
  }

  static async getApiKeys() {
    const response = await apiRequest("GET", "/api/admin/api-keys");
    return response.json();
  }
}
