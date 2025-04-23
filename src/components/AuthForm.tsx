import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function AuthForm() {
    const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [password, setPassword] = useState('')

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     const { error } = await supabase.auth.signInWithOtp({ email })

//     if (error) {
//       setMessage(`Error: ${error.message}`)
//     } else {
//       setMessage('Check your email for the login link!')
//     }

//     setLoading(false)
//   }

const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Successfully signed up! Check your email for confirmation.')
    }

    setLoading(false)
  }

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ 
        email,
        password
    })

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
    //   setMessage('Successfully logged in!'),
      navigate('/dashboard')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={isLogin ? handleLogin : handleSignUp} className="w-full max-w-sm mx-auto mt-20 space-y-4">
      <h2 className="text-xl font-semibold">{isLogin ? 'Login' : 'Sign Up'}</h2>
      {/* Add email input field */}
      <input
        className="w-full px-4 py-2 border rounded bg-white text-black"
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full px-4 py-2 border rounded bg-white text-black"
        type="password"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
       <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        disabled={loading}
      >
        {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
      </button>

      <button
        type="button"
        className="w-full text-blue-600 hover:text-blue-800 text-sm mt-2"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </button>

      {message && <p className="text-sm text-center text-gray-600">{message}</p>}
    </form>
  )
}