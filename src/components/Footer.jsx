import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <p className="footer-copy">
            © {new Date().getFullYear()} <strong>SJ Studio</strong>.  
            <span> Todos los derechos reservados.</span>
            <br />
            <span className="footer-slogan">"Diseños que se sienten"</span>
        </p>

        <div className="footer-socials">

          {/* FACEBOOK */}
          <a
            href="https://facebook.com/tupagina"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0022 12z"/>
            </svg>
            Facebook
          </a>

          {/* TELÉFONO */}
          <a href="tel:8115873337" aria-label="Teléfono">
            <svg viewBox="0 0 24 24">
              <path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.2c1.1.4 2.3.6 3.6.6a1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.3.2 2.5.6 3.6a1 1 0 01-.2 1z"/>
            </svg>
            8115873337
          </a>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/5218115873337"
            target="_blank"
            rel="noreferrer"
            className="whatsapp"
            aria-label="WhatsApp"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.5 3.5A11.8 11.8 0 002.2 17.8L1 23l5.4-1.4A11.8 11.8 0 1020.5 3.5zM12 21a9 9 0 01-4.6-1.3l-.3-.2-3.2.8.9-3.1-.2-.3A9 9 0 1112 21zm5-6.6c-.3-.1-1.6-.8-1.9-.9s-.5-.1-.7.1-.8.9-1 1.1-.4.2-.7.1a7.4 7.4 0 01-3.6-3.1c-.3-.5.3-.5.9-1.6.1-.2.1-.4 0-.6l-.9-2c-.2-.5-.4-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.2 1.4 3.4a12.6 12.6 0 005.4 4.8c2.3 1 2.3.7 2.7.6s1.6-.7 1.9-1.3.3-1.1.2-1.3-.3-.2-.6-.3z"/>
            </svg>
            WhatsApp
          </a>

        </div>
      </div>
    </footer>
  );
}
