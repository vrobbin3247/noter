import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const avatarOptions = [
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Tiger',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Bear',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Ghost',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Alien',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Robot',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Cat',
]

const SetupProfile = ({ checkProfile, userId }: { checkProfile: (id: string) => void, userId: string }) => {
  const [username, setUsername] = useState('')
  const [dob, setDob] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(avatarOptions[0])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      username,
      dob,
      avatar_url: avatarUrl,
    })

    if (!error) {
      toast.success('Profile saved!')
      await checkProfile(userId)
      navigate('/')
    } else {
      toast.error('Something went wrong.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Complete Your Profile</h2>
        
        {/* Avatar Selector */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Choose an Avatar</p>
          <div className="grid grid-cols-3 gap-4">
            {avatarOptions.map((url, i) => (
              <img
              key={i}
              src={url}
              onClick={() => setAvatarUrl(url)}  // ✅ changed here
              className={`w-20 h-20 rounded-full cursor-pointer border-2 ${
                avatarUrl === url ? 'border-blue-500 ring-2 ring-blue-300' : 'border-transparent'
              }`}
            />





            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={e => setDob(e.target.value)}
              required
              placeholder="DOB"
              className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition-colors ${
              loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default SetupProfile