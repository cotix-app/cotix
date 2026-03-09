import { useState } from "react";
import { login } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      const { data: sessionData } = await supabase.auth.getUser();

      const user = sessionData?.user;

      if (!user) {
        navigate("/");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        navigate("/admin");
      } else if (profile?.role === "empresa") {
        navigate("/empresa");
      } else {
        navigate("/");
      }
    } catch (e: any) {
      setError(e.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow w-80 space-y-3"
      >
        <h2 className="text-xl font-bold text-center">Ingresar a Cotix</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF7A00] text-white font-bold w-full p-2 rounded hover:bg-blue-800 transition"
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>

        <p className="text-center text-sm mt-2">
          ¿No tenés cuenta?{" "}
          <a href="/signup" className="text-blue-600 font-semibold">
            Registrarse
          </a>
        </p>
      </form>
    </div>
  );
}
