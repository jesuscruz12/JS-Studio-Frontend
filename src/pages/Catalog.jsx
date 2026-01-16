import { useEffect, useState } from "react";
import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/catalog.css";

export default function Catalog() {
  const [designs, setDesigns] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  useEffect(() => {
    api.get("/designs").then(res => setDesigns(res.data));
  }, []);

  const categories = [
    "Todos",
    ...new Set(designs.map(d => d.category))
  ];

  const filtered = designs.filter(d =>
    (category === "Todos" || d.category === category) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()))
  );

  const sendWhatsApp = (code) => {
    const msg = `Hola 👋 me interesa el diseño con código ${code}`;
    window.open(
      `https://wa.me/528115873337?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <>
      <Header />

      <main className="catalog-wrapper">
        <div className="catalog-controls">
          <input
            placeholder="Buscar por nombre o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <section className="catalog-grid">
          {filtered.map(d => (
            <div className="design-card" key={d._id}>
              <img src={d.imageUrl} alt={d.name} />

              <div className="design-info">
                <h3>{d.name}</h3>
                <span className="code">{d.code}</span>

                <div className="actions">
                  <button
                    className="copy"
                    onClick={() => navigator.clipboard.writeText(d.code)}
                  >
                    Copiar código
                  </button>

                  <button
                    className="whatsapp"
                    onClick={() => sendWhatsApp(d.code)}
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}
