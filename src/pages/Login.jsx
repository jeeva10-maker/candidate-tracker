import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../supabaseClient";

export default function Login() {
  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="default"
        providers={["google"]}
      />
    </div>
  );
}