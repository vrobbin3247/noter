import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function AuthForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [dob, setDob] = useState('')
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)

  const generateInitialsAvatar = (username: string) => {
    const initials = username.slice(0, 2).toUpperCase();
    return `https://api.dicebear.com/7.x/initials/svg?seed=${initials}&backgroundColor=fdfae0`;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Logged in!')
        navigate('/')
      }
    } else {
        const avatarUrl = generateInitialsAvatar(username);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            dob,
            avatar_url: avatarUrl 
          }
        }
      })

      if (error) {
        toast.error(error.message)
      } else {
        // Save to profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user?.id,
            username,
            dob,
            avatar_url: avatarUrl 
          })

        if (profileError) {
          toast.error(profileError.message)
        } else {
          setShowVerificationMessage(true)
          toast.success('Verification email sent! Please check your inbox.')
        }
      }
    }

    
    setLoading(false)
  }

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setDob('');
    setLoading(false);
    setShowVerificationMessage(false);
  };

  const handleBackToLogin = () => {
    setIsLogin(true);
    resetForm();
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <motion.form
        onSubmit={handleAuth}
        className="space-y-6 w-full max-w-sm p-8 "
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {showVerificationMessage ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
            <p className="text-gray-600">
              We've sent a verification link to <span className="font-semibold">{email}</span>.
              Please check your inbox and click the link to verify your account.
            </p>
            <p className="text-gray-600">
              Didn't receive the email? Check your spam folder or 
              <button 
                type="button" 
                className="text-blue-600 hover:underline ml-1"
                onClick={() => setShowVerificationMessage(false)}
              >
                try again
              </button>.
            </p>
            <button
              type="button"
              className="w-full py-2 text-white font-semibold rounded-md bg-gray-900 hover:bg-gray-800"
              onClick={handleBackToLogin}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </h2>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Choose a username"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 text-white font-semibold rounded-md ${
                loading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-gray-800'
              }`}
              disabled={loading}
            >
              {loading
                ? isLogin ? 'Logging in...' : 'Signing up...'
                : isLogin ? 'Login' : 'Create Account'}
            </button>

            <div className="text-center text-sm">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </motion.form>
    </div>
  )
}