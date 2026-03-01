import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Cliente from "./pages/Cliente";
import Activo from "./pages/Activo";
import Problemas from "./pages/Problemas";
import Tareas from "./pages/Tareas";
import Resumen from "./pages/Resumen";
import Historial from "./pages/Historial";
import Configuracion from "./pages/Configuracion";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

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