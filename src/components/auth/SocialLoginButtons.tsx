import { Button } from "@/components/ui/button";

type SocialLoginButtonsProps = {
  onSocialLogin: (provider: 'google' | 'apple' | 'facebook') => Promise<void>;
  isLoading: boolean;
};

export const SocialLoginButtons = ({ onSocialLogin, isLoading }: SocialLoginButtonsProps) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => onSocialLogin('google')}
        disabled={isLoading}
      >
        <img
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google"
          className="h-5 w-5 mr-2"
        />
        Continuer avec Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => onSocialLogin('apple')}
        disabled={isLoading}
      >
        <img
          src="https://authjs.dev/img/providers/apple.svg"
          alt="Apple"
          className="h-5 w-5 mr-2"
        />
        Continuer avec Apple
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => onSocialLogin('facebook')}
        disabled={isLoading}
      >
        <img
          src="https://authjs.dev/img/providers/facebook.svg"
          alt="Facebook"
          className="h-5 w-5 mr-2"
        />
        Continuer avec Facebook
      </Button>
    </div>
  );
};