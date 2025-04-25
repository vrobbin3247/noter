import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import { Session } from '@supabase/supabase-js'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import SetupProfile from './pages/SetupProfile'

function AppContent() {
  const [session, setSession] = useState<Session | null>(null)
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null)
  const location = useLocation()

  const showHeader = session && profileComplete && location.pathname === '/'

  const checkProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single()
    setProfileComplete(!!data?.username)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) checkProfile(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) checkProfile(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            session
              ? profileComplete === false
                ? <SetupProfile checkProfile={checkProfile} userId={session.user.id} />
                : <Dashboard />
              : <Login />
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setup-profile" element={
            session
              ? <SetupProfile checkProfile={checkProfile} userId={session.user.id} />
              : <Login />
          } />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App