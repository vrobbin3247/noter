import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        navigate('/') // not logged in, redirect to login
      } else {
        setUserEmail(data.user.email)
      }
    }

    getUser()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <p className="text-gray-700 mb-6">Welcome, {userEmail}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Placeholder cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border shadow-md p-4 bg-gradient-to-br from-blue-100 to-white">
            <p className="text-lg font-medium text-gray-800">Thought #{i}</p>
            <p className="text-gray-600 mt-2">This is a sample thought card.</p>
          </div>
        ))}
      </div>
    </div>
  )
}