import AuthForm from '../components/AuthForm'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
        {/* <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Welcome to Mura</h1>
          <p className="mt-2 text-sm text-gray-500">Your space to think.</p>
        </div> */}
        <AuthForm />
        <div className="text-center text-sm text-gray-600">
          {window.location.pathname === '/login' ? (
            <Link to="/" className="text-blue-600 hover:underline">← Back to home</Link>
          ) : (
            <Link to="/login" className="text-blue-600 hover:underline">→ Go to login</Link>
          )}
        </div>
      </div>
    </div>
  )
}