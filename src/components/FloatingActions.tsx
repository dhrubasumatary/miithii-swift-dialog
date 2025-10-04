import { Button } from "@/components/ui/button";
import { History, Settings, User } from "lucide-react";

interface FloatingActionsProps {
  onHistoryClick: () => void;
  onSettingsClick: () => void;
  isSignedIn?: boolean;
}

export const FloatingActions = ({
  onHistoryClick,
  onSettingsClick,
  isSignedIn = false,
}: FloatingActionsProps) => {
  return (
    <div className="fixed top-4 right-4 flex gap-2 z-50">
      <Button variant="outline" size="sm" onClick={onHistoryClick} className="rounded-xl">
        <History className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onSettingsClick} className="rounded-xl">
        <Settings className="h-4 w-4" />
      </Button>
      {isSignedIn ? (
        <Button variant="outline" size="sm" className="rounded-xl">
          <User className="h-4 w-4" />
        </Button>
      ) : (
        <>
          <Button variant="outline" size="sm" className="rounded-xl">
            Sign In
          </Button>
          <Button size="sm" className="rounded-xl">
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
};
