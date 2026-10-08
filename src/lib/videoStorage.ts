import { useEffect, useState } from "react";

const DB_NAME = "gtn-media";
const STORE_NAME = "videos";
const URL_PREFIX = "idb://video/";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE_NAME)) {
        req.result.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        action(tx.objectStore(STORE_NAME));
        tx.oncomplete = () => resolve(undefined as T);
        tx.onerror = () => reject(tx.error);
      }),
  );
}

export function isStoredVideo(url: string): boolean {
  return url.startsWith(URL_PREFIX);
}

export function storedVideoKey(url: string): string {
  return url.slice(URL_PREFIX.length);
}

export function videoKeyToUrl(key: string): string {
  return `${URL_PREFIX}${key}`;
}

export async function storeVideo(file: Blob): Promise<string> {
  const key = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  await openDb().then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(file, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      }),
  );
  return key;
}

export function loadVideo(key: string): Promise<Blob> {
  return openDb().then(
    (db) =>
      new Promise<Blob>((resolve, reject) => {
        const req = db
          .transaction(STORE_NAME, "readonly")
          .objectStore(STORE_NAME)
          .get(key);
        req.onsuccess = () => {
          const blob = req.result as Blob | undefined;
          if (blob) resolve(blob);
          else reject(new Error("Stored video not found"));
        };
        req.onerror = () => reject(req.error);
      }),
  );
}

export function deleteVideo(key: string): Promise<void> {
  return run<void>("readwrite", (store) => store.delete(key));
}

export function useVideoUrl(url?: string): string | undefined {
  const [src, setSrc] = useState<string | undefined>(url);

  useEffect(() => {
    if (!url || !isStoredVideo(url)) {
      setSrc(url);
      return;
    }
    let cancelled = false;
    let objectUrl: string | undefined;
    setSrc(undefined);
    loadVideo(storedVideoKey(url))
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setSrc(undefined);
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  return src;
}
