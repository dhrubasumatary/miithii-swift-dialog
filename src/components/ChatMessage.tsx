interface ChatMessageProps {
  content: string;
  isUser: boolean;
  isLoading?: boolean;
}

export const ChatMessage = ({ content, isUser, isLoading }: ChatMessageProps) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3.5 transition-all duration-300 ${
          isUser
            ? 'bg-user-message text-user-message-foreground shadow-elegant hover:shadow-lg self-end'
            : 'bg-ai-message text-ai-message-foreground shadow-soft border border-border/50 self-start'
        } ${isLoading ? 'animate-pulse' : ''}`}
      >
        <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
