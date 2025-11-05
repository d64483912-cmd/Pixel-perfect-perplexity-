import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPanel({ onClose }: { onClose?: () => void }) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    navigate("/sign-in");
  };

  const handleAppleSignIn = () => {
    navigate("/sign-in");
  };

  const handleEmailContinue = () => {
    navigate("/sign-in");
  };

  return (
    <div className="fixed right-6 top-20 w-80 bg-card border border-border rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex flex-col items-center mb-6">
        <img src="/logo.png" alt="Nelson-GPT" className="w-14 h-14 mb-4 rounded-lg shadow-sm" />
        <h2 className="text-lg font-semibold text-center mb-1">
          Sign in or create an account
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Unlock Pro Search and History
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full justify-center h-11 hover:bg-accent transition-all"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <Button
          onClick={handleAppleSignIn}
          variant="outline"
          className="w-full justify-center h-11 hover:bg-accent transition-all"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          Continue with Apple
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11"
        />

        <Button
          onClick={handleEmailContinue}
          variant="secondary"
          className="w-full h-11 transition-all"
        >
          Continue with email
        </Button>
      </div>

      <button className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
        Single sign-on (SSO)
      </button>
    </div>
  );
}
