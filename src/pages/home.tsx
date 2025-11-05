import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PerplexityLayout from "@/components/perplexity/PerplexityLayout";
import SearchInput from "@/components/perplexity/SearchInput";
import AuthPanel from "@/components/perplexity/AuthPanel";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [showAuthPanel, setShowAuthPanel] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (query: string) => {
    if (user) {
      navigate("/chat", { state: { initialQuery: query } });
    } else {
      setShowAuthPanel(true);
    }
  };

  return (
    <PerplexityLayout>
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <img src="/logo.png" alt="Nelson-GPT" className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-semibold text-foreground mb-2">
              Nelson-GPT
            </h1>
            <p className="text-lg text-muted-foreground">
              Pediatric Knowledge at Your Finger Tips
            </p>
          </div>

          <SearchInput onSubmit={handleSearch} />
        </div>

        {!user && showAuthPanel && (
          <AuthPanel onClose={() => setShowAuthPanel(false)} />
        )}
      </div>
    </PerplexityLayout>
  );
}
