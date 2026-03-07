import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { startSessionTimeout } from "./lib/sessionTimeout";
import AdminRoute from "./routes/AdminRoute";

import Home from "./pages/Home";
import Cliente from "./pages/Cliente";
import Activo from "./pages/Activo";
import Problemas from "./pages/Problemas";
import Tareas from "./pages/Tareas";
import Resumen from "./pages/Resumen";
import Historial from "./pages/Historial";
import Configuracion from "./pages/Configuracion";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";

function App() {

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    startSessionTimeout();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);

  }, []);

  if (showSplash) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-700">
        <img
          src="/splash.png"
          alt="Cotix"
          className="h-40"
        />
      </div>
    );
  }

  return (
    <Routes>

      {/* Public routes */}

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin routes */}

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Protected app routes */}

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>

          <Route path="/" element={<Home />} />
          <Route path="/cliente" element={<Cliente />} />
          <Route path="/activo" element={<Activo />} />
          <Route path="/problemas" element={<Problemas />} />
          <Route path="/tareas" element={<Tareas />} />
          <Route path="/resumen" element={<Resumen />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/configuracion" element={<Configuracion />} />

        </Route>
      </Route>

    </Routes>
  );
}

export default App;