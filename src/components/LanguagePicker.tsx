import { Button } from "@/components/ui/button";

interface LanguagePickerProps {
  onLanguageSelect: (language: string) => void;
}

export const LanguagePicker = ({ onLanguageSelect }: LanguagePickerProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-accent border border-accent-foreground/20 rounded-md shadow-sm p-6 text-center">
        <p className="text-accent-foreground font-medium mb-4">
          In what language would you like Miithii to talk to you?
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onLanguageSelect('english')}
            className="rounded-md"
          >
            English
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onLanguageSelect('assamese')}
            className="rounded-md"
          >
            অসমীয়া (Assamese)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onLanguageSelect('bodo')}
            className="rounded-md"
          >
            बर' (Bodo)
          </Button>
        </div>
      </div>
    </div>
  );
};
