import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function AuthForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      toast.error(error.message)
    } else {
      if (isLogin) {
        toast.success('Logged in!')
        navigate('/dashboard')
      } else {
        toast.success('Signed up! Check your email for confirmation.')
      }
    }

    setLoading(false)
  }

  return (
    <motion.form
      onSubmit={handleAuth}
      className="space-y-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-semibold text-center text-gray-700">
        {isLogin ? 'Sign in to your account' : 'Create an account'}
      </h2>

      <div className="relative">
        <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="email"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="relative">
        <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        <input
          type="password"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full py-2 text-white font-semibold rounded-md flex items-center justify-center gap-2 transition-all duration-200 ${
          loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        disabled={loading}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        )}
        {loading
          ? isLogin
            ? 'Logging in...'
            : 'Signing up...'
          : isLogin
          ? 'Login'
          : 'Sign Up'}
      </button>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-blue-600 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
    </motion.form>
  )
}