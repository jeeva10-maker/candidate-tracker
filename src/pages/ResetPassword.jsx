import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: '${window.location.origin}/reset-password',
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for the reset link!");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form
        onSubmit={handleReset}
        style={{
          padding: 20,
          background: "white",
          border: "1px solid #ddd",
          borderRadius: 8,
          width: 320,
        }}
      >
        <h2>Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          required
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Send Reset Link
        </button>
        {message && <p style={{ marginTop: 12 }}>{message}</p>}
      </form>
    </div>
  );
}