import { users, apiKeys, tokenUsage, type User, type InsertUser, type ApiKey, type InsertApiKey, type TokenUsage, type InsertTokenUsage } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getApiKeys(): Promise<ApiKey[]>;
  getActiveApiKey(): Promise<ApiKey | undefined>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  deactivateApiKey(id: number): Promise<void>;
  
  getTokenUsage(): Promise<TokenUsage[]>;
  createTokenUsage(usage: InsertTokenUsage): Promise<TokenUsage>;
  getTotalTokensUsed(): Promise<number>;
  getTokenUsageByModel(): Promise<Record<string, number>>;
  getTodayTokensUsed(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private apiKeys: Map<number, ApiKey>;
  private tokenUsage: Map<number, TokenUsage>;
  private currentId: number;
  private apiKeyId: number;
  private tokenUsageId: number;

  constructor() {
    this.users = new Map();
    this.apiKeys = new Map();
    this.tokenUsage = new Map();
    this.currentId = 1;
    this.apiKeyId = 1;
    this.tokenUsageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getApiKeys(): Promise<ApiKey[]> {
    return Array.from(this.apiKeys.values());
  }

  async getActiveApiKey(): Promise<ApiKey | undefined> {
    return Array.from(this.apiKeys.values()).find(key => key.isActive === 1);
  }

  async createApiKey(insertApiKey: InsertApiKey): Promise<ApiKey> {
    // Deactivate all existing keys
    this.apiKeys.forEach(key => {
      key.isActive = 0;
    });

    const id = this.apiKeyId++;
    const apiKey: ApiKey = { 
      ...insertApiKey, 
      id, 
      createdAt: new Date(), 
      isActive: 1 
    };
    this.apiKeys.set(id, apiKey);
    return apiKey;
  }

  async deactivateApiKey(id: number): Promise<void> {
    const apiKey = this.apiKeys.get(id);
    if (apiKey) {
      apiKey.isActive = 0;
    }
  }

  async getTokenUsage(): Promise<TokenUsage[]> {
    return Array.from(this.tokenUsage.values());
  }

  async createTokenUsage(insertTokenUsage: InsertTokenUsage): Promise<TokenUsage> {
    const id = this.tokenUsageId++;
    const usage: TokenUsage = { 
      ...insertTokenUsage, 
      id, 
      timestamp: new Date(),
      metadata: insertTokenUsage.metadata ?? null
    };
    this.tokenUsage.set(id, usage);
    return usage;
  }

  async getTotalTokensUsed(): Promise<number> {
    return Array.from(this.tokenUsage.values())
      .reduce((total, usage) => total + usage.tokensUsed, 0);
  }

  async getTokenUsageByModel(): Promise<Record<string, number>> {
    const usage: Record<string, number> = {};
    Array.from(this.tokenUsage.values()).forEach(item => {
      usage[item.model] = (usage[item.model] || 0) + item.tokensUsed;
    });
    return usage;
  }

  async getTodayTokensUsed(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.tokenUsage.values())
      .filter(usage => usage.timestamp >= today)
      .reduce((total, usage) => total + usage.tokensUsed, 0);
  }
}

export const storage = new MemStorage();
