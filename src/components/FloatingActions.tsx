import { Button } from "@/components/ui/button";
import { History, Settings, User } from "lucide-react";

interface FloatingActionsProps {
  onHistoryClick: () => void;
  onSettingsClick: () => void;
  isSignedIn?: boolean;
  onSignOut?: () => void;
}

export const FloatingActions = ({
  onHistoryClick,
  onSettingsClick,
  isSignedIn = false,
  onSignOut,
}: FloatingActionsProps) => {
  return (
    <div className="fixed top-6 right-6 flex gap-3 z-50">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onHistoryClick} 
        className="rounded-2xl glass-strong shadow-soft hover:shadow-elegant transition-all duration-300 hover:scale-105"
      >
        <History className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onSettingsClick} 
        className="rounded-2xl glass-strong shadow-soft hover:shadow-elegant transition-all duration-300 hover:scale-105"
      >
        <Settings className="h-4 w-4" />
      </Button>
      {isSignedIn ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSignOut} 
          className="rounded-2xl glass-strong shadow-soft hover:shadow-elegant transition-all duration-300 hover:scale-105"
        >
          <User className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      ) : (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-2xl glass-strong shadow-soft hover:shadow-elegant transition-all duration-300 hover:scale-105"
          >
            Sign In
          </Button>
          <Button 
            size="sm" 
            className="rounded-2xl shadow-elegant hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
};
