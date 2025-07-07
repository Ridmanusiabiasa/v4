import { useState, useEffect, useRef } from "react";
import { Conversation, Message } from "@/types/chat";
import { Bot, User, Copy, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from "@/components/ui/button";

interface MessageListProps {
  conversation?: Conversation;
  onConversationUpdate?: () => void;
}

export function MessageList({ conversation }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to bottom when messages change
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    // Small delay to ensure DOM is updated
    setTimeout(scrollToBottom, 50);
  }, [conversation?.messages, isLoading]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <WelcomeMessage />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="max-w-4xl mx-auto">
        {conversation.messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isLoading && <LoadingMessage />}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </ScrollArea>
  );
}

function WelcomeMessage() {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-[var(--chat-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
        <Bot size={32} className="text-white" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Welcome to RidChat AI</h2>
      <p className="text-[var(--chat-text-secondary)]">How can I help you today?</p>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  
  const handleCopy = async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [codeId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [codeId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  return (
    <div className={`group flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex gap-3 max-w-4xl w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-[var(--chat-primary)] text-white' 
            : 'bg-[var(--chat-surface)] border border-[var(--chat-border)]'
        }`}>
          {isUser ? (
            <User size={16} />
          ) : (
            <Bot size={16} className="text-[var(--chat-primary)]" />
          )}
        </div>
        
        {/* Message Content */}
        <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block max-w-full ${
            isUser 
              ? 'bg-[var(--chat-primary)] text-white rounded-2xl rounded-tr-md px-4 py-3' 
              : 'bg-[var(--chat-surface)] text-white rounded-2xl rounded-tl-md px-4 py-3 border border-[var(--chat-border)]'
          }`}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none prose-invert">
                <ReactMarkdown
                  components={{
                    code: ({ inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const language = match ? match[1] : '';
                      const codeString = String(children).replace(/\n$/, '');
                      const codeId = `code_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                      
                      if (!inline && language) {
                        return (
                          <div className="relative group/code my-4">
                            <div className="flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg text-sm">
                              <span className="font-medium">{language}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover/code:opacity-100 transition-opacity text-gray-300 hover:text-white"
                                onClick={() => handleCopy(codeString, codeId)}
                              >
                                {copiedStates[codeId] ? (
                                  <Check size={12} />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </Button>
                            </div>
                            <SyntaxHighlighter
                              style={oneDark}
                              language={language}
                              PreTag="div"
                              className="!mt-0 !rounded-t-none"
                              {...props}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          </div>
                        );
                      }
                      
                      return (
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm" {...props}>
                          {children}
                        </code>
                      );
                    },
                    p: ({ children }) => (
                      <p className="mb-3 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-xl font-bold mb-3">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-lg font-semibold mb-2">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-base font-medium mb-2">{children}</h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[var(--chat-border)] pl-4 italic my-3">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex gap-3 max-w-4xl w-full">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--chat-surface)] border border-[var(--chat-border)]">
          <Bot size={16} className="text-[var(--chat-primary)]" />
        </div>
        
        {/* Loading Content */}
        <div className="flex-1">
          <div className="bg-transparent text-[var(--chat-text)]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[var(--chat-text-secondary)] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[var(--chat-text-secondary)] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-[var(--chat-text-secondary)] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-sm text-[var(--chat-text-secondary)]">RidChat AI is typing...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
