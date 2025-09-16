import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../lib/supabase";

export default function Login() {
  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        redirectTo={window.location.origin}
      />
    </div>
  );
}
