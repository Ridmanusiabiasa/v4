import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApiKeySchema, insertTokenUsageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Chat completion proxy
  app.post("/api/chat/completions", async (req, res) => {
    try {
      const apiKey = await storage.getActiveApiKey();
      if (!apiKey) {
        return res.status(400).json({ error: "No API key configured" });
      }

      const response = await fetch("https://ai.sumopod.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.key}`,
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();
      
      if (response.ok && data.usage) {
        // Track token usage
        await storage.createTokenUsage({
          model: req.body.model,
          tokensUsed: data.usage.total_tokens,
          metadata: { 
            prompt_tokens: data.usage.prompt_tokens,
            completion_tokens: data.usage.completion_tokens
          }
        });
      }

      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to process chat completion" });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    
    // Get admin credentials from environment or use defaults
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "082254730892";
    
    console.log("Login attempt:", { username, providedPassword: password ? "***" : "none" });
    console.log("Expected credentials:", { expectedUsername: adminUsername, expectedPassword: adminPassword ? "***" : "none" });
    
    if (username === adminUsername && password === adminPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // API key management
  app.get("/api/admin/api-keys", async (req, res) => {
    try {
      const keys = await storage.getApiKeys();
      res.json(keys);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch API keys" });
    }
  });

  app.post("/api/admin/api-keys", async (req, res) => {
    try {
      const validatedData = insertApiKeySchema.parse(req.body);
      const apiKey = await storage.createApiKey(validatedData);
      res.json(apiKey);
    } catch (error) {
      res.status(400).json({ error: "Invalid API key data" });
    }
  });

  // Token usage stats
  app.get("/api/admin/token-usage", async (req, res) => {
    try {
      const totalTokens = await storage.getTotalTokensUsed();
      const todayTokens = await storage.getTodayTokensUsed();
      const usageByModel = await storage.getTokenUsageByModel();
      
      res.json({
        totalTokens,
        todayTokens,
        usageByModel
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch token usage" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
