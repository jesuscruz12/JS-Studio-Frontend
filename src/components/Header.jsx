import { useLocation, useNavigate } from "react-router-dom";
import "../styles/header.css";
import logo from "../assets/logoSJ.jpeg";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = location.pathname.startsWith("/admin");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* BRAND */}
        <div className="brand" onClick={() => navigate("/")}>
          <img src={logo} alt="SJ Studio Logo" />

          <div className="brand-text">
            <h1>SJ Studio</h1>
            <span>Diseños que se sienten</span>
          </div>
        </div>

        {/* NAV */}
        <nav className="nav">
          {!isAdmin ? (
            <>
              <a href="/">Catálogo</a>
              <a
                href="https://wa.me/528115873337"
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                WhatsApp
              </a>
            </>
          ) : (
            <>
              <span className="admin-badge">ADMIN</span>
              <button onClick={logout} className="btn-logout">
                Cerrar sesión
              </button>
            </>
          )}
        </nav>

      </div>
    </header>
  );
}
