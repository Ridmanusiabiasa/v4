import { Conversation } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation
}: SidebarProps) {
  return (
    <aside className="w-64 bg-[var(--chat-surface)] border-r border-[var(--chat-border)] flex flex-col">
      <div className="p-4 border-b border-[var(--chat-border)]">
        <Button
          onClick={onNewConversation}
          className="w-full bg-[var(--chat-primary)] hover:bg-[var(--chat-primary)]/80 text-white flex items-center gap-2"
        >
          <Plus size={16} />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group p-3 rounded-lg cursor-pointer transition-colors border ${
                conversation.id === currentConversationId
                  ? 'bg-[var(--chat-surface-light)] border-[var(--chat-border)]'
                  : 'hover:bg-[var(--chat-surface-light)] border-transparent hover:border-[var(--chat-border)]'
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare size={14} className="text-[var(--chat-text-secondary)]" />
                    <p className="text-sm font-medium truncate">{conversation.title}</p>
                  </div>
                  <p className="text-xs text-[var(--chat-text-secondary)] truncate">
                    {conversation.messages.length > 0 
                      ? conversation.messages[conversation.messages.length - 1].content.slice(0, 40) + '...'
                      : 'No messages yet'
                    }
                  </p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-[var(--chat-surface)]"
                    >
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[var(--chat-surface)] border-[var(--chat-border)]">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-[var(--chat-surface-light)] cursor-pointer"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-[var(--chat-border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--chat-primary)] rounded-full flex items-center justify-center">
            <MessageSquare size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">User</p>
            <p className="text-xs text-[var(--chat-text-secondary)]">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
