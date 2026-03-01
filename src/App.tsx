import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Cliente from "./pages/Cliente";
import Activo from "./pages/Activo";
import Problemas from "./pages/Problemas";
import Tareas from "./pages/Tareas";
import Resumen from "./pages/Resumen";
import Configuracion from "./pages/Configuracion";
import Historial from "./pages/Historial";
import PlanLimitado from "./pages/PlanLimitado";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/activo" element={<Activo />} />
        <Route path="/problemas" element={<Problemas />} />
        <Route path="/tareas" element={<Tareas />} />
        <Route path="/resumen" element={<Resumen />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/plam-limitado" element={<PlanLimitado />} />
       
      </Route>
    </Routes>
  );
}

export default App;