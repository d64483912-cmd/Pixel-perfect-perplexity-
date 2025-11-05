import PerplexityLayout from "@/components/perplexity/PerplexityLayout";

export default function Discover() {
  return (
    <PerplexityLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-2">Discover</h1>
          <p className="text-muted-foreground">
            Explore trending pediatric topics
          </p>
        </div>
      </div>
    </PerplexityLayout>
  );
}
