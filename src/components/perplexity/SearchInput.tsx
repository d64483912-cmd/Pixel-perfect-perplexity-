import { useState } from "react";
import {
  Search,
  Image,
  MapPin,
  Globe,
  Share2,
  Paperclip,
  Mic,
  ArrowUp,
} from "lucide-react";

interface SearchInputProps {
  onSubmit: (query: string) => void;
}

export default function SearchInput({ onSubmit }: SearchInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query);
      setQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickActions = [
    { icon: "🩺", label: "Diagnosis" },
    { icon: "💊", label: "Medications" },
    { icon: "👶", label: "Development" },
    { icon: "💉", label: "Vaccines" },
    { icon: "🚨", label: "Emergency" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask anything..."
          className="w-full px-6 pt-6 pb-3 text-base bg-transparent border-none outline-none resize-none min-h-[100px] placeholder:text-muted-foreground focus:outline-none"
          rows={3}
        />

        <div className="flex items-center justify-between px-5 pb-4 pt-2">
          <div className="flex items-center gap-1">
            <button className="p-2.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <Image className="w-4 h-4" />
            </button>
            <button className="p-2.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <MapPin className="w-4 h-4" />
            </button>
            <button className="p-2.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <Globe className="w-4 h-4" />
            </button>
            <button className="p-2.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <Paperclip className="w-4 h-4" />
            </button>
            <button className="p-2.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!query.trim()}
            className="rounded-full w-10 h-10 flex items-center justify-center bg-[#20B8CD] hover:bg-[#1ba5b8] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => setQuery(`${action.label}: `)}
            className="px-4 py-2.5 bg-card hover:bg-accent border border-border rounded-full text-sm font-medium transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <span>{action.icon}</span>
            <span className="text-foreground">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
