import { useEffect, useState } from "react";
import type { AgentBook } from "./agent.functions";

const KEY = "booklovers.favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<AgentBook[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  const save = (list: AgentBook[]) => {
    setFavorites(list);
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {}
  };

  const toggle = (book: AgentBook) => {
    const exists = favorites.some((f) => f.id === book.id);
    save(exists ? favorites.filter((f) => f.id !== book.id) : [...favorites, book]);
  };

  const remove = (id: string) => save(favorites.filter((f) => f.id !== id));

  const has = (id: string) => favorites.some((f) => f.id === id);

  return { favorites, toggle, remove, has };
}
