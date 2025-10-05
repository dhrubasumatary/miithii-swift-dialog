import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { FloatingActions } from "@/components/FloatingActions";
import { HistoryModal } from "@/components/HistoryModal";
import { SettingsModal } from "@/components/SettingsModal";
import { LanguagePicker } from "@/components/LanguagePicker";
import { streamChat } from "@/utils/chatStream";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  isLoading?: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
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
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        
        // Load user's language preference
        const { data: profile } = await supabase
          .from('profiles')
          .select('language')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.language) {
          setSelectedLanguage(profile.language);
        } else {
          // Show language picker if no preference exists
          setShowLanguagePicker(true);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Check if language is selected before allowing message
    if (!selectedLanguage) {
      setShowLanguagePicker(true);
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

  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
    setShowLanguagePicker(false);
    
    // Save language preference to database
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ language })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error saving language preference:', error);
        toast.error('Failed to save language preference');
      } else {
        toast.success(`Language set to ${
          language === "english"
            ? "English"
            : language === "assamese"
            ? "Assamese"
            : "Bodo"
        }`);
      }
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: `Great! I'll respond to you in ${
            language === "english"
              ? "English"
              : language === "assamese"
              ? "Assamese"
              : "Bodo"
          }. How can I assist you?`,
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
    // Keep the selected language (don't reset it)
    setShowLanguagePicker(false);
    setHistoryOpen(false);
    toast.success("New chat started");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <FloatingActions
        onHistoryClick={() => setHistoryOpen(true)}
        onSettingsClick={() => setSettingsOpen(true)}
        isSignedIn={true}
        onSignOut={handleSignOut}
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
