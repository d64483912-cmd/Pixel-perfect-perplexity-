import PerplexityLayout from "@/components/perplexity/PerplexityLayout";

export default function Spaces() {
  return (
    <PerplexityLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-2">Spaces</h1>
          <p className="text-muted-foreground">
            Organize your pediatric research
          </p>
        </div>
      </div>
    </PerplexityLayout>
  );
}
