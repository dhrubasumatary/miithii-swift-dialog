import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { FloatingActions } from "@/components/FloatingActions";
import { HistoryModal } from "@/components/HistoryModal";
import { SettingsModal } from "@/components/SettingsModal";
import { LanguagePicker } from "@/components/LanguagePicker";
import { toast } from "sonner";

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  isLoading?: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I am Miithii. How can I help you today?",
      isUser: false,
    },
  ]);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now(),
      content,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Show language picker after first user message if language not selected
    if (!selectedLanguage && messages.filter((m) => m.isUser).length === 0) {
      setShowLanguagePicker(true);
      return;
    }

    // Simulate AI response
    setTimeout(() => {
      const loadingMessage: Message = {
        id: Date.now() + 1,
        content: "Miithii is typing...",
        isUser: false,
        isLoading: true,
      };
      setMessages((prev) => [...prev, loadingMessage]);

      setTimeout(() => {
        setMessages((prev) => {
          const withoutLoading = prev.filter((m) => !m.isLoading);
          return [
            ...withoutLoading,
            {
              id: Date.now() + 2,
              content: "This is a mock response from Miithii. In a real implementation, this would be an AI-generated response based on your message.",
              isUser: false,
            },
          ];
        });
      }, 1500);
    }, 500);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguagePicker(false);
    toast.success(`Language set to ${language}`);

    // Add confirmation message
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: `Great! I'll respond to you in ${language === 'english' ? 'English' : language === 'assamese' ? 'Assamese' : 'Bodo'}. How can I assist you?`,
          isUser: false,
        },
      ]);
    }, 500);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 1,
        content: "Hello! I am Miithii. How can I help you today?",
        isUser: false,
      },
    ]);
    setSelectedLanguage(null);
    setShowLanguagePicker(false);
    setHistoryOpen(false);
    toast.success("New chat started");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <FloatingActions
        onHistoryClick={() => setHistoryOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
        isSignedIn={false}
      />

      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 pt-20 pb-4">
        <div className="flex-1 flex flex-col-reverse gap-4 overflow-y-auto mb-4">
          <div ref={messagesEndRef} />
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              isUser={message.isUser}
              isLoading={message.isLoading}
            />
          ))}
        </div>

        {showLanguagePicker && (
          <div className="mb-4">
            <LanguagePicker onLanguageSelect={handleLanguageSelect} />
          </div>
        )}
      </main>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={showLanguagePicker}
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
