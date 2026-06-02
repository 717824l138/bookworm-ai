import { createServerFn } from "@tanstack/react-start";
import { BOOKS, type Book } from "./books";

function score(book: Book, query: string): number {
  const q = query.toLowerCase();
  const tokens = q.split(/[^a-z0-9]+/).filter((t) => t.length > 2);
  const hay = [book.title, book.author, book.audience, ...book.genres, book.description]
    .join(" ")
    .toLowerCase();
  let s = 0;
  for (const t of tokens) {
    if (hay.includes(t)) s += 1;
    if (book.genres.some((g) => g.includes(t))) s += 2;
    if (book.audience.includes(t)) s += 2;
    if (book.title.toLowerCase().includes(t)) s += 3;
    if (book.author.toLowerCase().includes(t)) s += 3;
  }
  return s;
}

function retrieve(query: string, k = 5): Book[] {
  const ranked = BOOKS.map((b) => ({ b, s: score(b, query) }))
    .sort((a, b) => b.s - a.s);
  const top = ranked.filter((r) => r.s > 0).slice(0, k).map((r) => r.b);
  // If nothing matched, return a diverse default
  return top.length ? top : BOOKS.slice(0, k);
}

export type AgentBook = {
  id: string;
  title: string;
  author: string;
  summary: string;
  note: string;
};

export type AgentResponse = {
  intro: string;
  books: AgentBook[];
};

export const askBookAgent = createServerFn({ method: "POST" })
  .inputValidator((d: { query: string }) => {
    if (!d?.query || typeof d.query !== "string") throw new Error("query required");
    if (d.query.length > 500) throw new Error("query too long");
    return d;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const retrieved = retrieve(data.query, 6);

    const context = retrieved
      .map(
        (b) =>
          `ID: ${b.id}\nTitle: ${b.title}\nAuthor: ${b.author}\nGenres: ${b.genres.join(", ")}\nAudience: ${b.audience}\nYear: ${b.year}\nDescription: ${b.description}`,
      )
      .join("\n---\n");

    const systemPrompt = `You are BookLovers AI, a warm, knowledgeable book recommender.
You will be given a USER QUERY and a small CATALOG of candidate books retrieved from our local knowledge base.
Choose up to 4 of the MOST relevant books from the catalog (do not invent books or use any outside the catalog).
For each chosen book, write a short summary (1-2 sentences) and a personalized recommendation note explaining why it fits the user's query.
Also write a short friendly intro (one sentence).
Return your answer by calling the provided tool. Use the EXACT id, title, and author from the catalog.`;

    const userPrompt = `USER QUERY:\n${data.query}\n\nCATALOG:\n${context}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "recommend_books",
              description: "Return personalized book recommendations.",
              parameters: {
                type: "object",
                properties: {
                  intro: { type: "string" },
                  books: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        author: { type: "string" },
                        summary: { type: "string" },
                        note: { type: "string" },
                      },
                      required: ["id", "title", "author", "summary", "note"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["intro", "books"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "recommend_books" } },
      }),
    });

    if (response.status === 429) throw new Error("Too many requests — please try again in a moment.");
    if (response.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace settings.");
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      throw new Error("AI gateway error");
    }

    const json = await response.json();
    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) throw new Error("No recommendation returned");
    const parsed = JSON.parse(call.function.arguments) as AgentResponse;

    // Sanitize against catalog
    const byId = new Map(BOOKS.map((b) => [b.id, b]));
    parsed.books = (parsed.books ?? [])
      .filter((b) => byId.has(b.id))
      .slice(0, 4)
      .map((b) => {
        const real = byId.get(b.id)!;
        return { ...b, title: real.title, author: real.author };
      });

    return parsed;
  });
