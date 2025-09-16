import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  // When the page opens from the email link, Supabase sets a session for us.
  useEffect(() => {
    // make sure session is present (user coming from the magic link)
    supabase.auth.getSession().then(() => setChecking(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setErr(error.message);
    else setDone(true);
  };

  if (checking) return <p style={{ padding: 24 }}>Preparing reset…</p>;
  if (done)
    return (
      <div style={{ padding: 24 }}>
        <h2>Password updated!</h2>
        <a href="/">Go to app</a>
      </div>
    );

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: "40px auto" }}>
      <h2>Set a new password</h2>
      <form onSubmit={submit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
          required
        />
        <button type="submit" style={{ marginTop: 12, padding: "10px 16px" }}>
          Update password
        </button>
      </form>
      {err && <p style={{ color: "crimson", marginTop: 10 }}>{err}</p>}
    </div>
  );
}