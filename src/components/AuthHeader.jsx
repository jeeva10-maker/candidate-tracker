import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient"; // ✅ correct path

export default function AuthHeader() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) setUser(data.session?.user ?? null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      sub.subscription?.unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    // If they signed out while on a protected page, send to login
    if (loc.pathname !== "/login") nav("/login");
  };

  const email = user?.email;

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, fontSize: 14 }}>
      {email ? (
        <>
          <span>Signed in as <strong>{email}</strong></span>
          <button onClick={signOut} style={{ cursor: "pointer" }}>Sign out</button>
        </>
      ) : (
        <Link to="/login">Sign in</Link>
      )}
    </div>
  );
}