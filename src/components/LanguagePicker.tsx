import { Button } from "@/components/ui/button";

interface LanguagePickerProps {
  onLanguageSelect: (language: string) => void;
}

export const LanguagePicker = ({ onLanguageSelect }: LanguagePickerProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 animate-fade-in">
      <div className="glass-strong rounded-3xl shadow-elegant p-8 text-center border-2 border-primary/10">
        <p className="text-foreground font-semibold mb-6 text-lg">
          In what language would you like Miithii to talk to you?
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onLanguageSelect('english')}
            className="rounded-2xl px-8 shadow-soft hover:shadow-elegant transition-all duration-300 hover:scale-105"
          >
            English
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onLanguageSelect('assamese')}
            className="rounded-2xl px-8 shadow-soft hover:shadow-elegant transition-all duration-300 hover:scale-105"
          >
            অসমীয়া (Assamese)
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onLanguageSelect('bodo')}
            className="rounded-2xl px-8 shadow-soft hover:shadow-elegant transition-all duration-300 hover:scale-105"
          >
            बर' (Bodo)
          </Button>
        </div>
      </div>
    </div>
  );
};
