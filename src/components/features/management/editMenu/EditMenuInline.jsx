import { useState, useRef } from "react";
import axios from "axios";
import { API } from "../../../../Api.jsx";
import { convertToBase64 } from "../../../../helpers/ConvertToBase64.jsx";
import uploadIcon from "../../../../assets/image/Icons/upload.svg";

function EditMenuInline({ type, item, onClose, onSuccess }) {
  const [editName, setEditName] = useState(item?.name || "");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      let base64Image = item.imgProfile || null;
      if (profileImage) {
        base64Image = await convertToBase64(profileImage);
      }

      const updatePayload = {
        ...item,
        name: editName,
        imgProfile: base64Image,
      };

      // El truco de la "s": funciona para tournaments, teams y users
      const endpoint = `${API}/${type}s/${item.id}`;

      await axios.put(endpoint, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`✅ ${type} actualizado con éxito`);

      // Enviamos los datos actualizados al componente padre para que se refresque visualmente
      onSuccess(updatePayload);
      onClose();
    } catch (err) {
      console.error(`Error al actualizar el ${type}:`, err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "15px",
        backgroundColor: "#2a2a35",
        border: "1px solid #444",
        borderRadius: "8px",
        marginTop: "10px",
        marginBottom: "10px",
      }}
    >
      <h4 style={{ margin: 0, color: "#fff", fontSize: "14px" }}>
        Edit {type.charAt(0).toUpperCase() + type.slice(1)}
      </h4>

      {/* UPLOAD IMAGE */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "12px", color: "#aaa" }}>
          Image / Banner
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
            }}
          >
            <img src={uploadIcon} alt="Upload" style={{ width: "16px" }} />
          </button>
        </div>
      </div>

      {/* NAME INPUT */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
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

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
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
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            flex: 1,
            padding: "8px",
            background: "#444",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditMenuInline;
