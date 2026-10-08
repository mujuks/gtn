import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const LS_USERS = "gtn.users.v1";
const LS_SESSION = "gtn.session.v1";

export type AuthResult = { ok: true } | { ok: false; error: string };

type User = {
  username: string;
  hash: string;
  createdAt: string;
};

type AuthValue = {
  user: string | null;
  signUp: (username: string, password: string) => AuthResult;
  signIn: (username: string, password: string) => AuthResult;
  signOut: () => void;
};

function hashCode(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = (hash * 33) ^ text.charCodeAt(i);
  return (hash >>> 0).toString(36);
}

function readUsers(): User[] {
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as User[]) : [];
  } catch {
    return [];
  }
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(readUsers);
  const [user, setUser] = useState<string | null>(() =>
    localStorage.getItem(LS_SESSION),
  );

  useEffect(() => {
    localStorage.setItem(LS_USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) localStorage.setItem(LS_SESSION, user);
    else localStorage.removeItem(LS_SESSION);
  }, [user]);

  function signUp(username: string, password: string): AuthResult {
    const name = username.trim();
    if (name.length < 3)
      return { ok: false, error: "Username must be at least 3 characters." };
    if (password.length < 4)
      return { ok: false, error: "Password must be at least 4 characters." };
    if (users.some((existing) => existing.username === name)) {
      return { ok: false, error: "That username is already registered." };
    }
    const next: User = {
      username: name,
      hash: hashCode(password),
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, next]);
    setUser(name);
    return { ok: true };
  }

  function signIn(username: string, password: string): AuthResult {
    const name = username.trim();
    const found = users.find((existing) => existing.username === name);
    if (!found || found.hash !== hashCode(password)) {
      return { ok: false, error: "Invalid username or password." };
    }
    setUser(name);
    return { ok: true };
  }

  function signOut() {
    setUser(null);
  }

  const value: AuthValue = { user, signUp, signIn, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
