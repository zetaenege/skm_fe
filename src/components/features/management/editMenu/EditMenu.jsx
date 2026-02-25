import styles from "./EditMenu.module.css";
import { useState, useRef, useContext } from "react";
import axios from "axios";
import { API } from "../../../../Api.jsx";
import { AuthContext } from "../../../../assets/context/AuthContext.jsx";
import { convertToBase64 } from "../../../../helpers/ConvertToBase64.jsx";

import menuClose from "../../../../assets/image/Icons/menu_profile_close.svg";
import editIcon from "../../../../assets/icons/edit.svg";
import uploadIcon from "../../../../assets/image/Icons/upload.svg";

// Recibimos 'type' (user, admin, tournament) y 'data' (la información actual)
function EditMenu({ type = "user", data, onUpdateSuccess }) {
  const { refreshUser } = useContext(AuthContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);

  // Estados del Formulario (Solo Nombre y Foto)
  const [editName, setEditName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setFileName(file.name);
    }
  };

  const openEditMode = () => {
    setEditName(data?.name || "");
    setFileName("");
    setProfileImage(null);
    setIsEditingMode(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // 1. Convertir imagen si hay una nueva
      let base64Image = data?.imgProfile || null;
      if (profileImage) {
        base64Image = await convertToBase64(profileImage);
      }

      // 2. Preparar Payload (Mantenemos la info vieja, solo pisamos nombre y foto)
      const updatePayload = {
        ...data,
        name: editName,
        imgProfile: base64Image,
      };

      // 3. Decidir la ruta correcta según el tipo
      const endpoint =
        type === "tournament"
          ? `${API}/tournaments/${data.id}`
          : `${API}/users/${data.id}`;

      await axios.put(endpoint, updatePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(`✅ ${type} actualizado con éxito`);

      // 4. Refrescar la pantalla
      if (type === "user" || type === "admin") {
        if (refreshUser) await refreshUser();
      } else if (onUpdateSuccess) {
        // Si es torneo, ejecutamos la función que nos pase el padre para recargar
        onUpdateSuccess();
      }

      setIsMenuOpen(false);
      setIsEditingMode(false);
    } catch (err) {
      console.error(`Error al actualizar el ${type}:`, err);
    }
  };

  if (!data) return null; // Si no hay datos, no dibujamos el menú

  return (
    <div className={styles.menu__wrapper}>
      <button
        className={`${styles.menu__profile_edit} ${isMenuOpen ? styles.menu__profile_active : ""}`}
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
          if (isMenuOpen) setIsEditingMode(false);
        }}
        title="Settings"
      >
        <img src={menuClose} className={styles.menu__close_icon} alt="Menu" />
      </button>

      {isMenuOpen && (
        <div
          className={styles.dropdown__menu}
          style={{
            minWidth: isEditingMode ? "300px" : "180px",
            padding: isEditingMode ? "15px" : "8px 0",
          }}
        >
          {!isEditingMode ? (
            /* VISTA 1: MENÚ */
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li className={styles.dropdown__item} onClick={openEditMode}>
                <img
                  src={editIcon}
                  className={styles.dropdown__icon}
                  alt="Edit"
                />
                Edit Information
              </li>
            </ul>
          ) : (
            /* VISTA 2: FORMULARIO BETA (Solo Foto y Nombre) */
            <form
              onSubmit={handleEditSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <h4 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>
                Edit {type === "tournament" ? "Tournament" : "Profile"}
              </h4>

              {/* UPLOAD IMAGE */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label style={{ fontSize: "12px", color: "#aaa" }}>
                  {type === "tournament"
                    ? "Tournament Banner"
                    : "Profile Image"}
                </label>
                <div style={{ display: "flex", position: "relative" }}>
                  <input
                    type="text"
                    readOnly
                    placeholder="Upload new image..."
                    value={fileName}
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #444",
                      background: "#1e1e24",
                      color: "#fff",
                      cursor: "pointer",
                      paddingRight: "40px",
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    style={{
                      position: "absolute",
                      right: "2px",
                      top: "2px",
                      bottom: "2px",
                      background: "#4caf50",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0 10px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={uploadIcon}
                      alt="Upload"
                      style={{ width: "16px" }}
                    />
                  </button>
                </div>
              </div>

              {/* NAME INPUT */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <label style={{ fontSize: "12px", color: "#aaa" }}>Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #444",
                    background: "#1e1e24",
                    color: "#fff",
                  }}
                />
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "8px",
                    background: "#4caf50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingMode(false)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    background: "#444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default EditMenu;
