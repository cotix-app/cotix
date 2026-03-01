import { useState } from "react";
import { allowedUsers } from "../config/allowedUsers";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const emailNormalizado = email.trim().toLowerCase();

    if (!allowedUsers.includes(emailNormalizado)) {
      setError("No estás autorizado para acceder a Cotix.");
      return;
    }

    localStorage.setItem("cotixUser", emailNormalizado);
    navigate("/");
  };
console.log("allowedUsers:", allowedUsers);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">
          Acceso Cotix Beta
        </h1>

        <input
          type="email"
          placeholder="Tu email autorizado"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          className="w-full border p-3 rounded-lg mb-4"
        />

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="bg-blue-900 text-white py-3 px-4 rounded-xl w-full"
        >
          Ingresar
        </button>
      </div>
    </div>
  );
}