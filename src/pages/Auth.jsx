// src/pages/Auth.jsx
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../supabaseClient";

export default function AuthPage() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f6f7fb" }}>
      <div style={{ width: 420, maxWidth: "92vw" }}>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="default"
          providers={["google"]}
          redirectTo={window.location.origin + "/"}   // optional
        />
      </div>
    </div>
  );
}