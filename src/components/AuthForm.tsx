import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Check your email for the login link!')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleLogin} className="w-full max-w-sm mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-semibold">Login with Email</h2>
      <input
        className="w-full px-4 py-2 border rounded bg-white text-black"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Sending magic link...' : 'Send Magic Link'}
      </button>
      {message && <p className="text-sm text-center text-gray-600">{message}</p>}
    </form>
  )
}