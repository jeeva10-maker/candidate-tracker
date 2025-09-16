import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/"); // go back to candidates page
    }
    setLoading(false);
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Check your email to confirm your signup!");
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-sm space-y-4 border p-6 rounded shadow"
      >
        <h2 className="text-xl font-semibold text-center">Sign in / Sign up</h2>

        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <button
          type="button"
          onClick={handleSignUp}
          disabled={loading}
          className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}