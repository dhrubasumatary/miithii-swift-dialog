import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { FloatingActions } from "@/components/FloatingActions";
import { HistoryModal } from "@/components/HistoryModal";
import { SettingsModal } from "@/components/SettingsModal";
import { LanguagePicker } from "@/components/LanguagePicker";
import { streamChat } from "@/utils/chatStream";
import { toast } from "sonner";

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  isLoading?: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showLanguagePicker, setShowLanguagePicker] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!selectedLanguage) {
      toast.error('Please select a language first');
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      content,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);

    // Create conversation history for AI
    const conversationHistory = messages
      .filter((m) => !m.isLoading)
      .map((m) => ({
        role: m.isUser ? ("user" as const) : ("assistant" as const),
        content: m.content,
      }));

    conversationHistory.push({
      role: "user",
      content,
    });

    let assistantMessageId: number | null = null;
    let assistantContent = "";

    await streamChat({
      messages: conversationHistory,
      language: selectedLanguage || "english",
      onDelta: (chunk) => {
        assistantContent += chunk;
        
        setMessages((prev) => {
          if (assistantMessageId === null) {
            // Create new assistant message
            assistantMessageId = Date.now() + 1;
            return [
              ...prev,
              {
                id: assistantMessageId,
                content: assistantContent,
                isUser: false,
              },
            ];
          } else {
            // Update existing assistant message
            return prev.map((m) =>
              m.id === assistantMessageId
                ? { ...m, content: assistantContent }
                : m
            );
          }
        });
      },
      onDone: () => {
        setIsStreaming(false);
      },
      onError: (error) => {
        setIsStreaming(false);
        toast.error(error);
        
        // Remove loading message if exists
        setMessages((prev) => prev.filter((m) => !m.isLoading));
      },
    });
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguagePicker(false);
    
    const languageName = language === "english" ? "English" : language === "assamese" ? "Assamese" : "Bodo";
    
    setMessages([
      {
        id: Date.now(),
        content: `Hello! I am Miithii, your AI assistant. I'll respond to you in ${languageName}. How can I help you today?`,
        isUser: false,
      },
    ]);
  };

  const handleNewChat = () => {
    const languageName = selectedLanguage === "english" ? "English" : selectedLanguage === "assamese" ? "Assamese" : "Bodo";
    
    setMessages([
      {
        id: Date.now(),
        content: `Hello! I am Miithii, your AI assistant. I'll respond to you in ${languageName}. How can I help you today?`,
        isUser: false,
      },
    ]);
    setHistoryOpen(false);
    toast.success("New chat started");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <FloatingActions
        onHistoryClick={() => setHistoryOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
        isSignedIn={false}
        onSignOut={() => {}}
      />

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 pt-24 pb-4">
        {showLanguagePicker ? (
          <div className="flex-1 flex items-center justify-center">
            <LanguagePicker onLanguageSelect={handleLanguageSelect} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto mb-6 pr-2">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                isUser={message.isUser}
                isLoading={message.isLoading}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={!selectedLanguage || isStreaming}
      />

      <HistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        onNewChat={handleNewChat}
      />

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
};

export default Index;
