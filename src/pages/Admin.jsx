import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/admin.css";

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

export default function Admin() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [image, setImage] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setCode(`SJ-${Date.now().toString().slice(-6)}`);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("code", code);
    formData.append("category", category);
    formData.append("image", image);

    try {
      await api.post("/designs", formData);
      setMsg("success");
      setName("");
      setImage(null);
      setCode(`SJ-${Date.now().toString().slice(-6)}`);
    } catch {
      setMsg("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-card">
        <header className="admin-header">
          <h1>Panel Admin</h1>
          <p>Gestión de diseños · SJ Studio</p>
        </header>

        {msg === "success" && (
          <div className="alert success">✔ Diseño subido correctamente</div>
        )}
        {msg === "error" && (
          <div className="alert error">✖ Error al subir diseño</div>
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
            <label>Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Imagen del diseño</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button disabled={loading}>
            {loading ? "Subiendo..." : "Subir diseño"}
          </button>
        </form>
      </div>
    </div>
  );
}
