import { useState } from "react"
import { login } from "../lib/auth"
import { useNavigate } from "react-router-dom"

export default function Login() {

  const navigate = useNavigate()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")

  const handleLogin = async () => {

    try {

      await login(email,password)

      navigate("/")

    } catch(e:any){

      setError(e.message)

    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow w-80">

        <h2 className="text-xl font-bold mb-4 text-center">
          Ingresar a Cotix
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="bg-[#FF7A00] text-white font-bold w-full p-2 rounded hover:bg-blue-800 transition"
        >
          Entrar
        </button>

      </div>

    </div>

  )

}