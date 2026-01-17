import { useEffect, useState } from "react";
import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/catalog.css";

export default function Catalog() {
  const [designs, setDesigns] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const [selectedDesign, setSelectedDesign] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    api.get("/designs").then(res => setDesigns(res.data));
  }, []);

  const categories = ["Todos", ...new Set(designs.map(d => d.category))];

  const filtered = designs.filter(d =>
    (category === "Todos" || d.category === category) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()))
  );

  const sendWhatsApp = (design) => {
    const msg = `Hola 👋 me interesa el diseño "${design.name}" (${design.code}) por $${design.price} MXN`;
    window.open(
      `https://wa.me/528115873337?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const openDetails = (design) => {
    setSelectedDesign(design);
    setActiveImage(design.coverImage);
  };

  const closeDetails = () => {
    setSelectedDesign(null);
    setActiveImage(null);
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
              <div
                className="design-image"
                onClick={() => openDetails(d)}
              >
                <img src={d.coverImage} alt={d.name} />
              </div>

              <div className="design-info">
                <h3>{d.name}</h3>
                <p className="price">${d.price} MXN</p>
                <span className="code">{d.code}</span>

                {/* 🔥 ACCIONES CON JERARQUÍA */}
                <div className="actions">
                  <button
                    className="whatsapp"
                    onClick={() => sendWhatsApp(d)}
                  >
                    WhatsApp
                  </button>

                  <button
                    className="details"
                    onClick={() => openDetails(d)}
                  >
                    Ver detalles
                  </button>

                  <button
                    className="copy"
                    onClick={() => navigator.clipboard.writeText(d.code)}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* ===============================
           MODAL (SIN CAMBIOS)
      =============================== */}
      {selectedDesign && (
        <div className="modal-backdrop" onClick={closeDetails}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={closeDetails}>✕</button>

            <div className="modal-scroll">
              <img
                src={activeImage}
                alt={selectedDesign.name}
                className="modal-image"
              />

              <div className="modal-thumbs">
                {[selectedDesign.coverImage, ...(selectedDesign.galleryImages || [])].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className={activeImage === img ? "active" : ""}
                    onClick={() => setActiveImage(img)}
                  />
                ))}
              </div>

              <div className="modal-body">
                <h2>{selectedDesign.name}</h2>
                <p className="price">${selectedDesign.price} MXN</p>

                <ul className="details-list">
                  <li><strong>Tipo:</strong> {selectedDesign.type}</li>
                  <li><strong>Material:</strong> {selectedDesign.material}</li>
                  <li><strong>Colores:</strong> {selectedDesign.colors.join(", ")}</li>
                  <li><strong>Tallas:</strong> {selectedDesign.sizes.join(", ")}</li>
                </ul>

                <button
                  className="whatsapp big"
                  onClick={() => sendWhatsApp(selectedDesign)}
                >
                  Pedir por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
