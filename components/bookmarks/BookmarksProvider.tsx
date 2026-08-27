"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getDeviceId } from "@/lib/device";
import type { SavedItem } from "@/lib/supabase/types";

const CACHE_KEY = "uns_bookmarks";

type Cache = { collectionId: string | null; items: SavedItem[] };

function sameItem(a: SavedItem, b: { kind: string; itemId: string }) {
  return a.kind === b.kind && a.itemId === b.itemId;
}

function readCache(): Cache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { collectionId: null, items: [] };
    const parsed = JSON.parse(raw) as Cache;
    return { collectionId: parsed.collectionId ?? null, items: parsed.items ?? [] };
  } catch {
    return { collectionId: null, items: [] };
  }
}

function writeCache(cache: Cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // private mode / storage disabled — bookmarks still work for this session
  }
}

type BookmarksValue = {
  ready: boolean;
  collectionId: string | null;
  items: SavedItem[];
  count: number;
  isSaved: (kind: string, itemId: string) => boolean;
  toggle: (item: SavedItem) => void;
};

const BookmarksContext = createContext<BookmarksValue | null>(null);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [items, setItems] = useState<SavedItem[]>([]);

  // One-time hydration: seed from the local cache (can't be known during
  // render — it's browser-only), then reconcile against the server.
  useEffect(() => {
    const cache = readCache();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time localStorage hydration */
    setItems(cache.items);
    setCollectionId(cache.collectionId);
    /* eslint-enable react-hooks/set-state-in-effect */

    if (!cache.collectionId) {
      setReady(true);
      return;
    }
    let cancelled = false;
    fetch(`/api/bookmarks?collection=${cache.collectionId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: { items: ServerRow[] }) => {
        if (cancelled) return;
        const server = data.items.map(fromServerRow);
        setItems(server);
        writeCache({ collectionId: cache.collectionId, items: server });
      })
      .catch(() => {
        /* offline — keep the cached list */
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist whenever the list or collection changes.
  useEffect(() => {
    if (ready) writeCache({ collectionId, items });
  }, [ready, collectionId, items]);

  const isSaved = useCallback(
    (kind: string, itemId: string) => items.some((i) => sameItem(i, { kind, itemId })),
    [items],
  );

  const toggle = useCallback((item: SavedItem) => {
    const deviceId = getDeviceId();
    let wasSaved = false;
    setItems((prev) => {
      wasSaved = prev.some((i) => sameItem(i, item));
      return wasSaved ? prev.filter((i) => !sameItem(i, item)) : [item, ...prev];
    });

    const revert = () =>
      setItems((prev) =>
        wasSaved
          ? prev.some((i) => sameItem(i, item))
            ? prev
            : [item, ...prev]
          : prev.filter((i) => !sameItem(i, item)),
      );

    const req = wasSaved
      ? fetch("/api/bookmarks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId, kind: item.kind, itemId: item.itemId }),
        })
      : fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceId,
            kind: item.kind,
            itemId: item.itemId,
            title: item.title,
            subtitle: item.subtitle ?? null,
            href: item.href ?? null,
            emoji: item.emoji ?? null,
            badge: item.badge ?? null,
          }),
        });

    req
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: { collectionId?: string }) => {
        if (data.collectionId) setCollectionId(data.collectionId);
      })
      .catch(revert);
  }, []);

  const value = useMemo<BookmarksValue>(
    () => ({ ready, collectionId, items, count: items.length, isSaved, toggle }),
    [ready, collectionId, items, isSaved, toggle],
  );

  return <BookmarksContext.Provider value={value}>{children}</BookmarksContext.Provider>;
}

type ServerRow = {
  kind: string;
  item_id: string;
  title: string;
  subtitle: string | null;
  href: string | null;
  emoji: string | null;
  badge: string | null;
};

function fromServerRow(row: ServerRow): SavedItem {
  return {
    kind: row.kind as SavedItem["kind"],
    itemId: row.item_id,
    title: row.title,
    subtitle: row.subtitle,
    href: row.href,
    emoji: row.emoji,
    badge: row.badge,
  };
}

export function useBookmarks(): BookmarksValue {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error("useBookmarks must be used within <BookmarksProvider>");
  return ctx;
}
