import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import "../styles/Admin.css";

export default function DesignsList() {
  const navigate = useNavigate();

  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔎 filtros
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [active, setActive] = useState("true");

  const loadDesigns = async () => {
    setLoading(true);
    const { data } = await api.get("/designs/admin/filter", {
      params: { search, category, gender, active },
    });
    setDesigns(data);
    setLoading(false);
  };

  useEffect(() => {
    loadDesigns();
  }, [search, category, gender, active]);

  /* ===============================
     👁️ VER DETALLES (MODAL)
  =============================== */
  const viewDetails = (d) => {
    const images = [d.coverImage, ...(d.galleryImages || [])];

    Swal.fire({
      width: 760,
      showCloseButton: true,
      showConfirmButton: false,
      background: "#020617",
      color: "#fff",
      html: `
        <div style="display:flex;gap:24px;flex-wrap:wrap">

          <!-- IMAGEN -->
          <div style="flex:1;min-width:260px">
            <div style="overflow:hidden;border-radius:16px">
              <img 
                id="mainImage"
                src="${images[0]}"
                style="
                  width:100%;
                  border-radius:16px;
                  transition:transform .4s ease;
                  cursor:zoom-in
                "
                onmouseover="this.style.transform='scale(1.08)'"
                onmouseout="this.style.transform='scale(1)'"
              />
            </div>

            <!-- GALERÍA -->
            <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">
              ${images
                .map(
                  (img) => `
                <img 
                  src="${img}"
                  onclick="document.getElementById('mainImage').src='${img}'"
                  style="
                    width:64px;
                    height:64px;
                    object-fit:cover;
                    border-radius:12px;
                    cursor:pointer;
                    border:2px solid rgba(255,255,255,.2);
                    transition:all .2s
                  "
                  onmouseover="this.style.borderColor='#3b82f6'"
                  onmouseout="this.style.borderColor='rgba(255,255,255,.2)'"
                />
              `
                )
                .join("")}
            </div>
          </div>

          <!-- INFO -->
          <div style="flex:1;min-width:260px;text-align:left">
            <h2 style="margin:0 0 6px">${d.name}</h2>
            <p style="color:#9ca3af;margin-bottom:14px">
              Código: <b>${d.code}</b>
            </p>

            <div style="font-size:14px;line-height:1.7">
              <p><b>Categoría:</b> ${d.category}</p>
              <p><b>Tipo:</b> ${d.type}</p>
              <p><b>Sexo:</b> ${d.gender}</p>
              <p><b>Material:</b> ${d.material}</p>
              <p><b>Colores:</b> ${d.colors?.join(", ") || "-"}</p>
              <p><b>Tallas:</b> ${d.sizes?.join(", ") || "-"}</p>
            </div>

            <p style="
              font-size:22px;
              margin-top:16px;
              font-weight:700;
              color:#22c55e
            ">
              $${d.price}
            </p>
          </div>
        </div>
      `,
    });
  };

  /* ===============================
     🗑️ SOFT DELETE → PAPELERA
  =============================== */
  const softDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Enviar a la papelera?",
      text: "Podrás restaurar este diseño después",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, enviar",
    });

    if (!result.isConfirmed) return;

    await api.delete(`/designs/${id}`);

    Swal.fire({
      icon: "success",
      title: "Enviado a la papelera",
      timer: 1200,
      showConfirmButton: false,
    });

    loadDesigns();
  };

  /* ===============================
     ♻️ RESTAURAR
  =============================== */
  const restore = async (id) => {
    const result = await Swal.fire({
      title: "¿Restaurar diseño?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Restaurar",
    });

    if (!result.isConfirmed) return;

    await api.patch(`/designs/${id}/restore`);

    Swal.fire({
      icon: "success",
      title: "Diseño restaurado",
      timer: 1200,
      showConfirmButton: false,
    });

    loadDesigns();
  };

  /* ===============================
     ❌ ELIMINAR DEFINITIVO
  =============================== */
  const hardDelete = async (id) => {
    const result = await Swal.fire({
      title: "⚠️ Eliminar definitivamente",
      text: "Esta acción NO se puede deshacer",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar",
    });

    if (!result.isConfirmed) return;

    await api.delete(`/designs/${id}/permanent`);

    Swal.fire({
      icon: "success",
      title: "Diseño eliminado",
      timer: 1200,
      showConfirmButton: false,
    });

    loadDesigns();
  };

  return (
    <>
      <Header />

      <main className="admin-wrapper">
        <div className="admin-card">
          <header className="admin-header">
            <div>
              <h1>Diseños</h1>
              <p>CRUD · Administración de diseños</p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn-trash"
                onClick={() => setActive(active === "true" ? "false" : "true")}
              >
                {active === "true" ? "🗑️ Papelera" : "📦 Activos"}
              </button>

              <button
                className="btn-primary"
                onClick={() => navigate("/admin/designs/new")}
              >
                + Crear diseño
              </button>
            </div>
          </header>

          {/* 🔎 FILTROS */}
          <div className="filters">
            <input
              placeholder="Buscar por nombre"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select onChange={(e) => setCategory(e.target.value)}>
              <option value="">Categoría</option>
              <option>Religioso</option>
              <option>Anime</option>
              <option>Frases</option>
              <option>Deportivo</option>
            </select>

            <select onChange={(e) => setGender(e.target.value)}>
              <option value="">Sexo</option>
              <option>Hombre</option>
              <option>Mujer</option>
              <option>Unisex</option>
            </select>
          </div>

          {/* 📋 TABLA */}
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Sexo</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {designs.map((d) => (
                  <tr key={d._id}>
                    <td>
                      <img
                        src={d.coverImage}
                        alt={d.name}
                        style={{ cursor: "pointer" }}
                        onClick={() => viewDetails(d)}
                      />
                    </td>
                    <td>{d.name}</td>
                    <td>
                      <span className={`badge ${d.gender?.toLowerCase()}`}>
                        {d.gender}
                      </span>
                    </td>
                    <td>{d.category}</td>
                    <td>${d.price}</td>
                    <td className="actions">
                      {d.active ? (
                        <>
                          {/* ✏️ EDITAR (REUTILIZA ADMIN) */}
                          <button
                            onClick={() =>
                              navigate("/admin/designs/new", {
                                state: { design: d },
                              })
                            }
                          >
                            ✏️
                          </button>
                          <button
                            className="delete"
                            onClick={() => softDelete(d._id)}
                          >
                            🗑️
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="restore"
                            onClick={() => restore(d._id)}
                          >
                            ♻️
                          </button>
                          <button
                            className="delete"
                            onClick={() => hardDelete(d._id)}
                          >
                            ❌
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
