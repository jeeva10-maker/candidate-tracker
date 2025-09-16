import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabaseClient'

export default function AuthPage() {
  return (
    <div style={{minHeight:'100vh', display:'grid', placeItems:'center', background:'#f3f4f6'}}>
      <div style={{width: 380, background:'#fff', padding:24, borderRadius:12, boxShadow:'0 10px 20px rgba(0,0,0,0.08)'}}>
        <h2 style={{marginBottom:12, textAlign:'center'}}>Sign in / Sign up</h2>
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
      </div>
    </div>
  )
}
