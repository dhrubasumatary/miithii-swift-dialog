import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="sticky bottom-0 glass-strong py-6">
      <div className="max-w-3xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message to Miithii..."
            disabled={disabled}
            className="flex-1 rounded-2xl h-12 px-5 shadow-soft border-border/50 focus:shadow-elegant focus:border-primary/50 transition-all duration-300"
          />
          <Button
            type="submit"
            disabled={disabled || !message.trim()}
            className="rounded-2xl px-8 h-12 shadow-elegant hover:shadow-lg transition-all duration-300"
            size="default"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
