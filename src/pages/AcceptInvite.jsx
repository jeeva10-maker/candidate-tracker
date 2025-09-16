import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function AcceptInvitePage() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const token = params.get('token') || ''
  const [session, setSession] = useState(null)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription?.unsubscribe?.()
  }, [])

  const onJoin = async () => {
    if (!token) return alert('Missing invite token')
    if (!session) return alert('Please sign in first')
    setClaiming(true)
    const { data, error } = await supabase.rpc('claim_invite', { p_token: token })
    setClaiming(false)
    if (error) {
      console.error(error)
      alert(error.message || 'Failed to accept invite')
      return
    }
    // Success → land on the app
    nav('/')
  }

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: '0 auto' }}>
      <h2>Accept invite</h2>
      {!token && <p>Invalid invite link.</p>}

      {!session && (
        <>
          <p>Sign up or sign in to continue:</p>
          <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
            <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
          </div>
        </>
      )}

      {session && token && (
        <div style={{ marginTop: 16 }}>
          <p>You are signed in as <strong>{session.user.email}</strong>.</p>
          <button onClick={onJoin} disabled={claiming} style={btn}>
            {claiming ? 'Joining…' : 'Join organization'}
          </button>
        </div>
      )}
    </div>
  )
}

const btn = { padding:'10px 12px', borderRadius:8, border:'1px solid #111', background:'#111', color:'#fff', cursor:'pointer' }
