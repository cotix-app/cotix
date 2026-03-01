import { BrowserRouter, Routes, Route } from "react-router-dom";
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
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cliente"
          element={
            <ProtectedRoute>
              <Cliente />
            </ProtectedRoute>
          }
        />

        <Route
          path="/activo"
          element={
            <ProtectedRoute>
              <Activo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/problemas"
          element={
            <ProtectedRoute>
              <Problemas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tareas"
          element={
            <ProtectedRoute>
              <Tareas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resumen"
          element={
            <ProtectedRoute>
              <Resumen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/historial"
          element={
            <ProtectedRoute>
              <Historial />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracion"
          element={
            <ProtectedRoute>
              <Configuracion />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;