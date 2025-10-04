import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNewChat: () => void;
}

const mockHistory = [
  { id: 1, snippet: "Tell me about the weather", timestamp: "2 hours ago" },
  { id: 2, snippet: "What is machine learning?", timestamp: "1 day ago" },
  { id: 3, snippet: "Help me write an email", timestamp: "2 days ago" },
  { id: 4, snippet: "Explain quantum computing", timestamp: "3 days ago" },
  { id: 5, snippet: "Recipe for pasta carbonara", timestamp: "1 week ago" },
];

export const HistoryModal = ({ open, onOpenChange, onNewChat }: HistoryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chat History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-2">
            {mockHistory.map((item) => (
              <button
                key={item.id}
                className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <p className="text-sm font-medium truncate">{item.snippet}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
        <Button onClick={onNewChat} className="w-full rounded-xl mt-4">
          New Chat
        </Button>
      </DialogContent>
    </Dialog>
  );
};
