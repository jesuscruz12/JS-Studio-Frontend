import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import "../styles/Admin.css";

// ================= CONSTANTES =================
const CATEGORIES = [
  "Religioso", "Anime", "Frases", "Parejas", "Fechas especiales",
  "Personalizado", "Infantil", "Deportivo", "Arte", "Minimalista",
  "Humor", "Música", "Vintage",
];

const TYPES = ["Playera", "Sudadera", "Hoodie", "Tote bag"];
const MATERIALS = ["Algodón", "Poliéster", "Algodón + Poliéster"];
const COLORS = ["Blanco", "Negro", "Gris", "Rojo", "Azul"];
const SIZES = ["CH", "M", "G", "XG"];
const GENDERS = ["Hombre", "Mujer", "Unisex"];
const MAX_GALLERY = 5; // Límite de imágenes en galería

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [coverPreview, setCoverPreview] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);

  // 🧠 DETECTAR EDICIÓN
  const editingDesign = location.state?.design;
  const isEdit = Boolean(editingDesign);

  // === ESTADOS DEL FORMULARIO ===
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [gender, setGender] = useState(GENDERS[0]);
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [code, setCode] = useState("");

  // === MANEJO DE IMÁGENES ===
  const [coverImage, setCoverImage] = useState(null); // Archivo nuevo para portada
  
  // Galería dividida: URLs existentes (backend) vs Archivos nuevos (frontend)
  const [existingGallery, setExistingGallery] = useState([]); 
  const [galleryFiles, setGalleryFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  /* ==============================================
      🧠 PRECARGAR DATOS SI ES MODO EDICIÓN
  ============================================== */
  useEffect(() => {
    if (!isEdit) {
      // Generar código aleatorio para nuevos productos
      setCode(`SJ-${Date.now().toString().slice(-6)}`);
      return;
    }

    // Cargar datos del producto a editar
    setName(editingDesign.name);
    setCategory(editingDesign.category);
    setPrice(editingDesign.price);
    setType(editingDesign.type);
    setGender(editingDesign.gender);
    setMaterial(editingDesign.material);
    setColors(editingDesign.colors || []);
    setSizes(editingDesign.sizes || []);
    setCode(editingDesign.code);
    
    // Cargar galería existente
    setCoverPreview(editingDesign.coverImage || null);
    setExistingGallery(editingDesign.galleryImages || []);
  }, [isEdit, editingDesign]);
  useEffect(() => {
    setRemoveCover(false);
  }, [editingDesign]);


  // Función auxiliar para Checkboxes
  const toggleValue = (value, list, setList) => {
    setList(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  /* ==============================================
      🖼️ LÓGICA DE GALERÍA (AGREGAR / ELIMINAR)
  ============================================== */
  const handleAddGalleryImage = (file) => {
    if (!file) return;

    // Validar límite total (existentes + nuevas)
    if (existingGallery.length + galleryFiles.length >= MAX_GALLERY) {
      Swal.fire({
        icon: "warning",
        title: "Límite alcanzado",
        text: `Máximo ${MAX_GALLERY} imágenes permitidas en la galería.`,
      });
      return;
    }

    setGalleryFiles((prev) => [...prev, file]);
  };

  /* ==============================================
      🔙 CANCELAR / REGRESAR
  ============================================== */
  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "¿Cancelar cambios?",
      text: "Los cambios no guardados se perderán",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Seguir editando",
    });

    if (!result.isConfirmed) return;
    navigate("/DesignsList");
  };

  /* ==============================================
      📤 SUBMIT (CREAR / EDITAR)
  ============================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("code", code);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("type", type);
    formData.append("gender", gender);
    formData.append("material", material);
    formData.append("colors", JSON.stringify(colors));
    formData.append("sizes", JSON.stringify(sizes));

    // Si hay una nueva imagen de portada, la agregamos
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    // 1. Enviar las URLs que el usuario decidió MANTENER (Backend debe manejarlas)
    if (isEdit) {
      existingGallery.forEach((imgUrl) => {
        formData.append("existingGallery", imgUrl);
      });
    }

    // 2. Enviar los NUEVOS archivos para subir
    galleryFiles.forEach((file) => {
      formData.append("galleryImages", file);
    });

    if (removeCover) {
      formData.append("removeCover", "true");
    }

    try {
      if (isEdit) {
        await api.put(`/designs/${editingDesign._id}`, formData);
        
        await Swal.fire({
          icon: "success",
          title: "Diseño actualizado",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await api.post("/designs", formData);

        await Swal.fire({
          icon: "success",
          title: "Diseño creado",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      navigate("/DesignsList");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el diseño",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="admin-wrapper">
        <div className="admin-card1">
          <header className="admin-header">
            <div>
              <h1>{isEdit ? "Editar diseño" : "Crear diseño"}</h1>
              <p>Gestión de diseños · SJ Studio</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="admin-form">
            {/* NOMBRE */}
            <div className="field">
              <label>Nombre del diseño</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* CÓDIGO */}
            <div className="field">
              <label>Código</label>
              <input value={code} disabled />
            </div>

            {/* PRECIO */}
            <div className="field">
              <label>Precio ($MXN)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            {/* CATEGORÍA */}
            <div className="field">
              <label>Categoría</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* TIPO */}
            <div className="field">
              <label>Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* SEXO */}
            <div className="field">
              <label>Sexo</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                {GENDERS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* MATERIAL */}
            <div className="field">
              <label>Material</label>
              <select value={material} onChange={(e) => setMaterial(e.target.value)}>
                {MATERIALS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* COLORES */}
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

            {/* TALLAS */}
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

            {/* IMAGEN PRINCIPAL (COVER) */}
            <div className="field">
              <label>Imagen principal (Portada)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setCoverImage(file);
                  setCoverPreview(URL.createObjectURL(file));
                  setRemoveCover(false);
                }}
                required={!isEdit} // Solo requerida si es nuevo
              />
              {coverPreview && (
                <div className="gallery-preview">
                  <div className="img-box large">
                    <img src={coverPreview} alt="Portada" />
                    <button
                      type="button"
                      className="remove"
                      onClick={async () => {
                      const res = await Swal.fire({
                        title: "¿Eliminar portada?",
                        text: "Esta imagen se eliminará al guardar",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "Cancelar",
                      });

                      if (!res.isConfirmed) return;

                      setCoverImage(null);
                      setCoverPreview(null);
                      setRemoveCover(true);
                    }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* GALERÍA DE IMÁGENES */}
            <div className="field">
              <label>Galería adicional (Máx {MAX_GALLERY})</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAddGalleryImage(e.target.files[0])}
              />

              {/* PREVISUALIZACIÓN DE GALERÍA */}
              <div className="gallery-preview">
                {/* 1. Imágenes ya existentes en base de datos */}
                {existingGallery.map((imgUrl, i) => (
                  <div key={`exist-${i}`} className="img-box">
                    <img src={imgUrl} alt="Existente" />
                    <button
                      type="button"
                      className="remove"
                      onClick={() =>
                        setExistingGallery(existingGallery.filter((_, idx) => idx !== i))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* 2. Nuevas imágenes seleccionadas para subir */}
                {galleryFiles.map((file, i) => (
                  <div key={`new-${i}`} className="img-box">
                    <img src={URL.createObjectURL(file)} alt="Nueva" />
                    <button
                      type="button"
                      className="remove"
                      onClick={() =>
                        setGalleryFiles(galleryFiles.filter((_, idx) => idx !== i))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="form-actions" style={{ display: "flex", gap: "12px", marginTop: 24 }}>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading 
                  ? "Guardando..." 
                  : isEdit ? "Guardar cambios" : "Subir diseño"
                }
              </button>
              
              {isEdit && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              )}
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}