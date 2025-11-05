import { ReactNode } from "react";
import LeftSidebar from "./LeftSidebar";

interface PerplexityLayoutProps {
  children: ReactNode;
}

export default function PerplexityLayout({ children }: PerplexityLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <LeftSidebar />
      <main className="ml-16 min-h-screen">{children}</main>
    </div>
  );
}
