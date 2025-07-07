import { Conversation } from "@/types/chat";
import { Sidebar } from "./sidebar";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { LocalStorage } from "@/lib/storage";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { AI_MODELS } from "@/types/chat";

interface ChatInterfaceProps {
  conversations: Conversation[];
  currentConversation?: Conversation;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onUpdateConversations: (conversations: Conversation[]) => void;
}

export function ChatInterface({
  conversations,
  currentConversation,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onUpdateConversations
}: ChatInterfaceProps) {
  const handleConversationUpdate = () => {
    const updated = LocalStorage.getConversations();
    onUpdateConversations(updated);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversation?.id || ''}
        onNewConversation={onNewConversation}
        onSelectConversation={onSelectConversation}
        onDeleteConversation={onDeleteConversation}
      />
      
      <main className="flex-1 flex flex-col">
        <ChatHeader />
        
        <MessageList
          conversation={currentConversation}
          onConversationUpdate={handleConversationUpdate}
        />
        
        <ChatInput
          conversationId={currentConversation?.id || ''}
          onConversationUpdate={handleConversationUpdate}
        />
      </main>
    </div>
  );
}

function ChatHeader() {
  const [settings, setSettings] = useState(LocalStorage.getSettings());

  const handleModelChange = (model: string) => {
    const newSettings = { ...settings, model };
    setSettings(newSettings);
    LocalStorage.saveSettings(newSettings);
  };

  return (
    <header className="bg-[var(--chat-surface)] border-b border-[var(--chat-border)] p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">RidChat AI</h1>
        
        <select
          value={settings.model}
          onChange={(e) => handleModelChange(e.target.value)}
          className="bg-[var(--chat-surface-light)] border border-[var(--chat-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--chat-primary)] focus:border-transparent"
        >
          <option value="gpt-4o-mini">GPT-4o Mini</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
          <option value="gpt-4.1-nano">GPT-4.1 Nano</option>
          <option value="gpt-4.1">GPT-4.1</option>
        </select>
      </div>
    </header>
  );
}
