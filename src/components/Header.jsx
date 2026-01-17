import "../styles/header.css";
import logo from "../assets/logoSJ.jpeg";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">

        {/* BRAND */}
        <div className="brand">
          <img src={logo} alt="SJ Studio Logo" />

          <div className="brand-text">
            <h1>SJ Studio</h1>
            <span>"Diseños que se sienten"</span>
          </div>
        </div>

        {/* NAV */}
        <nav className="nav">
          <a href="#catalogo">Catálogo</a>
          <a
            href="https://wa.me/528115873337"
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp"
          >
            WhatsApp
          </a>
        </nav>

      </div>
    </header>
  );
}
