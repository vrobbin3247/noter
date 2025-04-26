import AuthForm from '../components/AuthForm'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md rounded-2xl ">
        <AuthForm />
      </div>
    </div>
  )
}