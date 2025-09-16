import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSignIn(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setMsg(error.message);
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const { error } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) setMsg(error.message);
    else setMsg("Account created. Check email if confirmation is required, then sign in.");
  }

  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Sign in</h1>
      <p style={{ color: "#555", marginBottom: 16 }}>
        Use email & password. (If you don’t have an account yet, click <strong>Sign up</strong>.)
      </p>

      <form onSubmit={handleSignIn} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <button
          disabled={busy}
          type="submit"
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #2563eb",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={handleSignUp}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            color: "#111827",
            cursor: "pointer",
          }}
        >
          {busy ? "Creating account…" : "Sign up"}
        </button>

        {msg && (
          <div style={{ marginTop: 6, color: "#b91c1c" }}>
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}