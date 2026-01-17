import { useEffect, useState } from "react";
import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Admin.css";

const CATEGORIES = [
  "Religioso",
  "Anime",
  "Frases",
  "Parejas",
  "Fechas especiales",
  "Personalizado",
  "Infantil",
  "Deportivo",
  "Arte",
  "Minimalista",
  "Humor",
  "Música",
  "Vintage",
];

const TYPES = ["Playera", "Sudadera", "Hoodie", "Tote bag"];
const MATERIALS = ["Algodón", "Poliéster", "Algodón + Poliéster"];
const COLORS = ["Blanco", "Negro", "Gris", "Rojo", "Azul"];
const SIZES = ["CH", "M", "G", "XG"];

export default function Admin() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  // 🔹 IMÁGENES
  const [coverImage, setCoverImage] = useState(null);          // catálogo
  const [galleryImages, setGalleryImages] = useState([]);      // detalles

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setCode(`SJ-${Date.now().toString().slice(-6)}`);
  }, []);

  const toggleValue = (value, list, setList) => {
    setList(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("code", code);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("type", type);
    formData.append("material", material);
    formData.append("colors", JSON.stringify(colors));
    formData.append("sizes", JSON.stringify(sizes));

    // 👇 imagen principal
    formData.append("coverImage", coverImage);

    // 👇 galería
    for (let i = 0; i < galleryImages.length; i++) {
      formData.append("galleryImages", galleryImages[i]);
    }

    try {
      await api.post("/designs", formData);
      setMsg("success");

      // reset
      setName("");
      setPrice("");
      setColors([]);
      setSizes([]);
      setCoverImage(null);
      setGalleryImages([]);
      setCode(`SJ-${Date.now().toString().slice(-6)}`);
    } catch {
      setMsg("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="admin-wrapper">
        <div className="admin-card">
          <header className="admin-header">
            <h1>Panel Administrativo</h1>
            <p>Gestión de diseños · SJ Studio</p>
          </header>

          {msg === "success" && (
            <div className="alert success">
              ✔ Diseño subido correctamente
            </div>
          )}

          {msg === "error" && (
            <div className="alert error">
              ✖ Error al subir diseño
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="field">
              <label>Nombre del diseño</label>
              <input
                placeholder="Ej. Playera San Judas"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Código</label>
              <input value={code} disabled />
            </div>

            <div className="field">
              <label>Precio ($MXN)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Categoría</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Material</label>
              <select value={material} onChange={(e) => setMaterial(e.target.value)}>
                {MATERIALS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Colores disponibles</label>
              <div className="checkbox-group">
                {COLORS.map((c) => (
                  <label key={c}>
                    <input
                      type="checkbox"
                      checked={colors.includes(c)}
                      onChange={() => toggleValue(c, colors, setColors)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Tallas disponibles</label>
              <div className="checkbox-group">
                {SIZES.map((s) => (
                  <label key={s}>
                    <input
                      type="checkbox"
                      checked={sizes.includes(s)}
                      onChange={() => toggleValue(s, sizes, setSizes)}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            {/* 👇 IMAGEN PRINCIPAL */}
            <div className="field">
              <label>Imagen principal (catálogo)</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setCoverImage(e.target.files[0])}
              />
            </div>

            {/* 👇 GALERÍA */}
            <div className="field">
              <label>Imágenes adicionales (galería)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setGalleryImages(e.target.files)}
              />
            </div>

            <button disabled={loading}>
              {loading ? "Subiendo..." : "Subir diseño"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
