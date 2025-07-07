import { useState, useEffect } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { LocalStorage } from "@/lib/storage";
import { Conversation } from "@/types/chat";

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');

  useEffect(() => {
    const loadedConversations = LocalStorage.getConversations();
    const currentId = LocalStorage.getCurrentConversationId();
    
    setConversations(loadedConversations);
    setCurrentConversationId(currentId || '');
  }, []);

  const handleNewConversation = () => {
    const conversation = LocalStorage.createConversation("New Chat");
    setConversations([conversation, ...conversations]);
    setCurrentConversationId(conversation.id);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    LocalStorage.setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    LocalStorage.deleteConversation(id);
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    
    if (currentConversationId === id) {
      const newCurrentId = updated[0]?.id || '';
      setCurrentConversationId(newCurrentId);
      LocalStorage.setCurrentConversationId(newCurrentId);
    }
  };

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  return (
    <div className="h-screen bg-[var(--chat-bg)] text-[var(--chat-text)]">
      <ChatInterface
        conversations={conversations}
        currentConversation={currentConversation}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onUpdateConversations={setConversations}
      />
    </div>
  );
}
