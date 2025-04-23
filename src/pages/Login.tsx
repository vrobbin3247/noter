import AuthForm from '../components/AuthForm'

export default function Login() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <AuthForm />
        </div>
      </div>
    )
  }