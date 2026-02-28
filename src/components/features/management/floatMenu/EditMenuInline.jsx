import { useState, useRef } from "react";
import axios from "axios";
import { API } from "../../../../Api.jsx";
import { convertToBase64 } from "../../../../helpers/ConvertToBase64.jsx";
import uploadIcon from "../../../../assets/image/Icons/upload.svg";
import styles from "./floatMenu.module.css";
import Button from "../../../common/button/Button.jsx";

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
    <form className={styles.dropdown__form_inline} onSubmit={handleSubmit}>
      <h4 className={styles.form__title}>
        Edit {type.charAt(0).toUpperCase() + type.slice(1)}
      </h4>

      {/* UPLOAD IMAGE */}
      <div className={styles.form__input__wrapper}>
        <label className={styles.form__label}>Image</label>
        <div className={styles.input__group_upload}>
          <input
            type="text"
            readOnly
            placeholder="Upload new image..."
            value={fileName}
            onClick={() => fileInputRef.current.click()}
            className={styles.form__input}
          />
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            className={styles.upload__button}
            type="button"
            variant="search"
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src={uploadIcon}
              alt="Upload"
              className={styles.upload__icon}
            />
          </Button>
        </div>
      </div>

      {/* NAME INPUT */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label className={styles.form__label}>Name</label>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          required
          className={styles.form__input}
        />
      </div>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
        <Button type="submit" children="save " variant="requestaccept">
          Save
        </Button>
        <Button
          type="button"
          onClick={() => setIsEditingMode(false)}
          children="Decline "
          variant="requestdecline"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default EditMenuInline;
