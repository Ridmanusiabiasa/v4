import { Conversation, Message } from "@/types/chat";

const STORAGE_KEYS = {
  CONVERSATIONS: 'chat_conversations',
  CURRENT_CONVERSATION: 'current_conversation_id',
  SETTINGS: 'chat_settings',
  API_KEY: 'api_key',
  ADMIN_SESSION: 'admin_session'
} as const;

export interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
}

export class LocalStorage {
  static getConversations(): Conversation[] {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (!data) return [];
    
    try {
      const conversations = JSON.parse(data);
      return conversations.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch {
      return [];
    }
  }

  static saveConversations(conversations: Conversation[]): void {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }

  static getCurrentConversationId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
  }

  static setCurrentConversationId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, id);
  }

  static getSettings(): ChatSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      return {
        model: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: -1 // Unlimited tokens
      };
    }
    
    try {
      const settings = JSON.parse(data);
      // Ensure unlimited tokens for existing users
      if (settings.maxTokens && settings.maxTokens < 100000) {
        settings.maxTokens = -1;
      }
      return settings;
    } catch {
      return {
        model: 'gpt-4o-mini',
        temperature: 0.7,
        maxTokens: -1 // Unlimited tokens
      };
    }
  }

  static saveSettings(settings: ChatSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  static getApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  }

  static setApiKey(key: string): void {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
  }

  static getAdminSession(): boolean {
    const session = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    if (!session) return false;
    
    try {
      const data = JSON.parse(session);
      return data.authenticated && new Date(data.expires) > new Date();
    } catch {
      return false;
    }
  }

  static setAdminSession(authenticated: boolean): void {
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hour session
    
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify({
      authenticated,
      expires: expires.toISOString()
    }));
  }

  static clearAdminSession(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }

  static createConversation(title: string): Conversation {
    const conversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const conversations = this.getConversations();
    conversations.unshift(conversation);
    this.saveConversations(conversations);
    this.setCurrentConversationId(conversation.id);

    return conversation;
  }

  static updateConversation(id: string, updates: Partial<Conversation>): void {
    const conversations = this.getConversations();
    const index = conversations.findIndex(c => c.id === id);
    
    if (index !== -1) {
      conversations[index] = {
        ...conversations[index],
        ...updates,
        updatedAt: new Date()
      };
      this.saveConversations(conversations);
    }
  }

  static addMessage(conversationId: string, message: Message): void {
    const conversations = this.getConversations();
    const conversation = conversations.find(c => c.id === conversationId);
    
    if (conversation) {
      conversation.messages.push(message);
      conversation.updatedAt = new Date();
      
      // Update title if it's the first user message
      if (conversation.messages.length === 1 && message.role === 'user') {
        conversation.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
      }
      
      this.saveConversations(conversations);
    }
  }

  static deleteConversation(id: string): void {
    const conversations = this.getConversations();
    const filtered = conversations.filter(c => c.id !== id);
    this.saveConversations(filtered);
    
    if (this.getCurrentConversationId() === id) {
      this.setCurrentConversationId(filtered[0]?.id || '');
    }
  }
}
