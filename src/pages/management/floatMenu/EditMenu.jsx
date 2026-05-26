import styles from "./floatMenu.module.css";
import { useState, useRef, useContext } from "react";
import axios from "axios";
import { API } from "../../../Api.jsx";
import { AuthContext } from "../../../assets/context/AuthContext.jsx";
import { convertToBase64 } from "../../../helpers/ConvertToBase64.jsx";
import editIcon from "../../../assets/icons/edit.svg";
import uploadIcon from "../../../assets/image/Icons/upload.svg";
import Button from "../../../components/common/button/Button.jsx";

function EditMenu({ type = "user", data, onUpdateSuccess }) {
  const { refreshUser } = useContext(AuthContext);
  const [isEditingMode, setIsEditingMode] = useState(false);
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
      let base64Image = data?.imgProfile || null;
      if (profileImage) {
        base64Image = await convertToBase64(profileImage);
      }

      const updatePayload = {
        ...data,
        name: editName,
        imgProfile: base64Image,
      };

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

      if (type === "user" || type === "admin") {
        if (refreshUser) await refreshUser();
      } else if (onUpdateSuccess) {
        onUpdateSuccess();
      }

      setIsEditingMode(false);
    } catch (err) {
      console.error(`Error al actualizar el ${type}:`, err);
    }
  };

  if (!data) return null;

  return (
    <>
      {!isEditingMode ? (
        <div className={styles.dropdown__item} onClick={openEditMode}>
          <img src={editIcon} className={styles.dropdown__icon} alt="Edit" />
          <p>Edit Information</p>
        </div>
      ) : (
        <form
          className={` animate__dropdown_enter ${styles.dropdown__form}`}
          onSubmit={handleEditSubmit}
        >
          <h4 className={styles.form__title}>
            Edit {type === "tournament" ? "Tournament" : "Profile"}
          </h4>
          <div className={styles.form__input__wrapper}>
            <label className={styles.form__label}>
              {type === "tournament" ? "Tournament Banner" : "Profile Image"}
            </label>

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

          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
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
      )}
    </>
  );
}

export default EditMenu;
