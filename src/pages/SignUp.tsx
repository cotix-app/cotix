import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const handleSignup = async (e:any) => {

    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    setLoading(false);

    if(error){

      alert(error.message);
      return;

    }

    alert("Cuenta creada. Revisá tu email para confirmar.");

    navigate("/login");

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >

        <h2 className="text-xl font-bold text-center">
          Crear cuenta
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-2 rounded"
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>

      </form>

    </div>

  );

}