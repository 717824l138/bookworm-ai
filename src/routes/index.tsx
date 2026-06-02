import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { BookHeart, Heart, Loader2, Search, Sparkles, Trash2 } from "lucide-react";
import { askBookAgent, type AgentBook, type AgentResponse } from "@/lib/agent.functions";
import { useFavorites } from "@/lib/useFavorites";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BookLovers AI — Find your next favorite book" },
      {
        name: "description",
        content:
          "Ask BookLovers AI for personalized book recommendations. Agentic RAG over a curated library of fiction, sci-fi, romance, and more.",
      },
      { property: "og:title", content: "BookLovers AI" },
      {
        property: "og:description",
        content: "Personalized book recommendations powered by an agentic AI librarian.",
      },
    ],
  }),
  component: Home,
});

const SUGGESTIONS = [
  "Suggest fantasy books for teens",
  "A cozy romance for a long weekend",
  "Mind-bending sci-fi like Project Hail Mary",
  "Non-fiction to understand human history",
];

function Home() {
  const ask = useServerFn(askBookAgent);
  const { favorites, toggle, has, remove } = useFavorites();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AgentResponse | null>(null);

  const mutation = useMutation({
    mutationFn: (q: string) => ask({ data: { query: q } }),
    onSuccess: (data) => setResult(data),
    onError: (e: Error) => toast.error(e.message || "Something went wrong"),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    mutation.mutate(q);
  };

  const runSuggestion = (s: string) => {
    setQuery(s);
    mutation.mutate(s);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header
        className="relative overflow-hidden"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl">
            <BookHeart className="h-6 w-6 text-primary" />
            <span className="font-semibold">BookLovers AI</span>
          </div>
          <a
            href="#favorites"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Favorites · {favorites.length}
          </a>
        </nav>

        <div className="max-w-3xl mx-auto px-6 pt-10 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-card/70 backdrop-blur px-3 py-1 text-xs text-muted-foreground border">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Agentic RAG · powered by Lovable AI
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold leading-[1.05]">
            Find your next favorite{" "}
            <span className="text-primary italic">book</span>.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Describe a mood, a genre, or a beloved author — our reading agent
            will curate four hand-picked recommendations from our library.
          </p>

          <form
            onSubmit={submit}
            className="mt-8 mx-auto max-w-2xl bg-card border rounded-2xl p-2 flex items-center gap-2 shadow-[var(--shadow-soft)]"
          >
            <Search className="h-5 w-5 ml-3 text-muted-foreground shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Suggest fantasy books for teens"
              className="flex-1 bg-transparent outline-none py-3 text-base placeholder:text-muted-foreground"
              aria-label="Ask for book recommendations"
            />
            <button
              type="submit"
              disabled={mutation.isPending || !query.trim()}
              className="rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity inline-flex items-center gap-2"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Ask
            </button>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => runSuggestion(s)}
                className="text-xs sm:text-sm rounded-full border bg-card/60 hover:bg-card transition-colors px-3 py-1.5 text-muted-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-14">
        {mutation.isPending && (
          <div className="text-center text-muted-foreground py-20">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-primary" />
            The librarian is browsing the shelves…
          </div>
        )}

        {result && !mutation.isPending && (
          <section>
            <p className="text-center text-lg italic text-muted-foreground max-w-2xl mx-auto">
              {result.intro}
            </p>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {result.books.map((b, i) => (
                <BookCard
                  key={b.id}
                  book={b}
                  index={i}
                  saved={has(b.id)}
                  onToggle={() => {
                    toggle(b);
                    toast.success(has(b.id) ? "Removed from favorites" : "Saved to favorites");
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {!result && !mutation.isPending && (
          <div className="text-center text-muted-foreground py-10">
            Ask anything about books — genres, moods, similar authors, age groups.
          </div>
        )}

        {/* Favorites */}
        <section id="favorites" className="mt-24 scroll-mt-24">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold">Your favorites</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Saved locally on this device.
              </p>
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-card/40 p-10 text-center text-muted-foreground">
              No favorites yet — tap the heart on any recommendation.
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-4">
              {favorites.map((b) => (
                <li
                  key={b.id}
                  className="rounded-2xl border bg-card p-5 flex items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="font-display text-lg leading-tight">{b.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      by {b.author}
                    </p>
                    <p className="text-sm mt-2 line-clamp-2">{b.summary}</p>
                  </div>
                  <button
                    onClick={() => remove(b.id)}
                    aria-label="Remove favorite"
                    className="text-muted-foreground hover:text-destructive transition-colors p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="border-t mt-10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          © 2026 BookLovers AI
        </div>
      </footer>
    </div>
  );
}

const PASTELS = ["bg-[var(--blush)]", "bg-[var(--mint)]", "bg-[var(--butter)]", "bg-[var(--sky)]"];

function BookCard({
  book,
  index,
  saved,
  onToggle,
}: {
  book: AgentBook;
  index: number;
  saved: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="group rounded-2xl border bg-card overflow-hidden hover:shadow-[var(--shadow-soft)] transition-shadow">
      <div className={`${PASTELS[index % PASTELS.length]} px-6 py-5 flex items-start justify-between`}>
        <div>
          <h3 className="font-display text-xl leading-tight">{book.title}</h3>
          <p className="text-sm text-foreground/70 mt-1">by {book.author}</p>
        </div>
        <button
          onClick={onToggle}
          aria-label={saved ? "Remove from favorites" : "Save to favorites"}
          className="shrink-0 rounded-full bg-card/70 backdrop-blur p-2 hover:bg-card transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${saved ? "fill-primary text-primary" : "text-foreground/60"}`}
          />
        </button>
      </div>
      <div className="px-6 py-5 space-y-3">
        <p className="text-sm text-foreground/80 leading-relaxed">{book.summary}</p>
        <div className="pt-3 border-t">
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
            Why you'll love it
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">{book.note}</p>
        </div>
      </div>
    </article>
  );
}
