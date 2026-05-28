import styles from "./floatMenu.module.css";
import { useState, useRef, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom"; //
import { API } from "../../../Api.jsx";
import { AuthContext } from "../../../assets/context/AuthContext.jsx";
import { convertToBase64 } from "../../../helpers/ConvertToBase64.jsx";
import editIcon from "../../../assets/icons/edit.svg";
import uploadIcon from "../../../assets/image/Icons/upload.svg";
import Button from "../../../components/common/button/Button.jsx";

function EditMenuTour({ type = "tournament", data, onUpdateSuccess }) {
  const { refreshUser } = useContext(AuthContext);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const location = useLocation();
  const id = location.pathname.split("/").filter(Boolean).pop();

  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    const fetchTournamentInfo = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem("token");
        const response = await API.get(`/tournaments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFetchedData(response.data);
      } catch (err) {
        console.error("Error obteniendo info del torneo:", err);
      }
    };
    fetchTournamentInfo();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setFileName(file.name);
    }
  };

  const openEditMode = () => {
    const currentData = fetchedData || data;
    setEditName(currentData?.name || "");
    setFileName("");
    setProfileImage(null);
    setIsEditingMode(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const currentData = fetchedData || data;
      let base64Image = currentData?.imgProfile || null;

      if (profileImage) {
        base64Image = await convertToBase64(profileImage);
      }

      const updatePayload = {
        ...currentData,
        name: editName,
        imgProfile: base64Image,
      };

      const endpoint = `/tournaments/${id}`;

      await API.put(endpoint, updatePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      window.dispatchEvent(new Event("torneoActualizado"));

      if (type === "user" || type === "admin") {
        if (refreshUser) await refreshUser();
      } else if (onUpdateSuccess) {
        onUpdateSuccess();
      }

      setIsEditingMode(false);
      setFetchedData(updatePayload);
    } catch (err) {
      console.error(`Error al actualizar el ${type}:`, err);
    }
  };

  return (
    <>
      {!isEditingMode ? (
        <div className={styles.dropdown__item} onClick={openEditMode}>
          <img src={editIcon} className={styles.dropdown__icon} alt="Edit" />
          <p>Edit League</p>
        </div>
      ) : (
        <form className={styles.dropdown__form} onSubmit={handleEditSubmit}>
          <h4 className={styles.form__title}>Edit Tournament</h4>
          <div className={styles.form__input__wrapper}>
            <label className={styles.form__label}>Tournament Banner</label>

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

export default EditMenuTour;
