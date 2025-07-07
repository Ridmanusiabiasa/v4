import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { ChatAPI } from "@/lib/chat-api";
import { LocalStorage } from "@/lib/storage";
import { Message } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  conversationId: string;
  onConversationUpdate?: () => void;
}

export function ChatInput({ conversationId, onConversationUpdate }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    try {
      // Create conversation if it doesn't exist
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        const newConversation = LocalStorage.createConversation(userMessage.slice(0, 50));
        currentConversationId = newConversation.id;
      }

      // Add user message
      const userMessageObj: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };

      LocalStorage.addMessage(currentConversationId, userMessageObj);
      onConversationUpdate?.();

      // Get conversation messages for context
      const conversation = LocalStorage.getConversations().find(c => c.id === currentConversationId);
      const messages = conversation?.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })) || [];

      // Get settings
      const settings = LocalStorage.getSettings();

      // Send to AI
      const requestData: any = {
        model: settings.model,
        messages: messages,
        temperature: settings.temperature
      };
      
      // Only include max_tokens if it's not unlimited (-1)
      if (settings.maxTokens > 0) {
        requestData.max_tokens = settings.maxTokens;
      }
      
      const response = await ChatAPI.sendMessage(requestData);

      // Add AI response
      const aiMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: response.choices[0].message.content,
        timestamp: new Date(),
        model: settings.model
      };

      LocalStorage.addMessage(currentConversationId, aiMessage);
      onConversationUpdate?.();

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please check your API key configuration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="bg-[var(--chat-bg)] border-t border-[var(--chat-border)] p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end bg-[var(--chat-surface)] border border-[var(--chat-border)] rounded-2xl overflow-hidden">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message RidChat AI..."
              className="min-h-[52px] max-h-96 resize-none bg-transparent border-0 p-4 pr-12 text-[var(--chat-text)] placeholder:text-[var(--chat-text-secondary)] focus:ring-0 focus:outline-none"
              disabled={isLoading}
              maxLength={undefined}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || isLoading}
              className="absolute right-2 bottom-2 bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)]/80 text-white h-8 w-8 p-0 rounded-lg disabled:opacity-50"
            >
              <Send size={16} />
            </Button>
          </div>
        </form>
        
        <div className="flex items-center justify-between mt-2 text-xs text-[var(--chat-text-secondary)]">
          <span>Press Enter to send, Shift+Enter for new line • Unlimited text length</span>
          <TokenCounter />
        </div>
      </div>
    </div>
  );
}

function TokenCounter() {
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    const updateTokens = async () => {
      try {
        const stats = await ChatAPI.getTokenUsage();
        setTotalTokens(stats.totalTokens);
      } catch {
        // Ignore errors for token counting
      }
    };

    updateTokens();
    const interval = setInterval(updateTokens, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return <span>{totalTokens} tokens used</span>;
}
