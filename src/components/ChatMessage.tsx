interface ChatMessageProps {
  content: string;
  isUser: boolean;
  isLoading?: boolean;
}

export const ChatMessage = ({ content, isUser, isLoading }: ChatMessageProps) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-user-message text-user-message-foreground self-end'
            : 'bg-ai-message text-ai-message-foreground self-start'
        } ${isLoading ? 'animate-pulse' : ''}`}
      >
        <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
