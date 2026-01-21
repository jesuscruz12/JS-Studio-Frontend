import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Catalog from "./pages/Catalog";
import ProtectedRoute from "./components/ProtectedRoute";
import DesignsList from "./pages/DesignsList";

function App() {
  return (
    <Routes>
      {/* CATÁLOGO PÚBLICO */}
      <Route path="/" element={<Catalog />} />

      {/* LOGIN ADMIN */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/designs/new" element={<Admin />} />

      {/* PANEL ADMIN (PROTEGIDO) */}
      <Route
        path="/DesignsList"
        element={
          <ProtectedRoute>
            <DesignsList />
          </ProtectedRoute>
        }
      />

      {/* CUALQUIER RUTA DESCONOCIDA */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
