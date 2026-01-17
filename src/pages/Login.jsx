import { useState } from "react";
import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin";
    } catch {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <>
      <Header />

      <main className="login-wrapper">
        <form className="login-card" onSubmit={handleSubmit}>
          <h1>Panel Administrativo</h1>
          <p className="login-subtitle">Acceso exclusivo · SJ Studio</p>

          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@sjstudio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Entrar</button>
        </form>
      </main>

      <Footer />
    </>
  );
}
