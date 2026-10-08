import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../store/AuthContext";

type Mode = "signin" | "register";

export default function AuthPanel() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (mode === "register" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const result =
      mode === "signin"
        ? signIn(username, password)
        : signUp(username, password);
    if (!result.ok) setError(result.error);
  }

  const tabClass = (active: Mode) =>
    `auth__tab${mode === active ? " auth__tab--active" : ""}`;

  return (
    <section className="auth" aria-label="Sign in or register">
      <div className="auth__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signin"}
          className={tabClass("signin")}
          onClick={() => switchMode("signin")}
        >
          Sign In
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "register"}
          className={tabClass("register")}
          onClick={() => switchMode("register")}
        >
          Register
        </button>
      </div>

      <form className="form" onSubmit={onSubmit}>
        <label>
          <span>Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            autoComplete="username"
            required
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              mode === "register" ? "At least 4 characters" : "Your password"
            }
            autoComplete={
              mode === "register" ? "new-password" : "current-password"
            }
            required
          />
        </label>
        {mode === "register" && (
          <label>
            <span>Confirm password</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              required
            />
          </label>
        )}

        {error && <p className="flash">{error}</p>}

        <button className="btn" type="submit">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </button>

        <p className="auth__note">
          {mode === "signin"
            ? "New here? Switch to Register to create an account."
            : "Already registered? Switch to Sign In."}
          Accounts and sessions are stored locally in your browser.
        </p>
      </form>
    </section>
  );
}
