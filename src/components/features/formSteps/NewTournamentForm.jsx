import Button from "../../common/button/Button.jsx";
import styles from "./FormSteps.module.css";
import { useState, useRef } from "react";
import axios from "axios";
import { API } from "../../../Api.jsx";
import { convertToBase64 } from "../../../helpers/ConvertToBase64.jsx";
import uploadIcon from "../../../assets/image/Icons/upload.svg";
import Confirmation from "./confirmations/Confirmation.jsx";

function NewTournamentForm() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [city, setCity] = useState("");

  // Nuevos estados para la imagen del torneo
  const [profileImage, setProfileImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // <-- Cambiado a booleano

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setFileName(file.name);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be later than end date");
      return;
    }

    if (!name || !startDate || !endDate || !city) {
      setError("Please fill in all required fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create a tournament");
      return;
    }

    try {
      let base64Image = null;
      if (profileImage) {
        base64Image = await convertToBase64(profileImage);
      }

      const response = await axios.post(
        `${API}/tournaments`,
        {
          name,
          imgProfile: base64Image,
          startDate,
          endDate,
          city,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Tournament created:", response.data);

      // Activamos la pantalla de éxito
      setSuccess(true);

      // Eliminamos el setTimeout para que el usuario controle la navegación
    } catch (err) {
      console.error("Error creating tournament", err);
      if (err.response) {
        const status = err.response.status;
        if (status === 403) {
          setError("Forbidden: Only ADMINs can create tournaments.");
        } else if (status === 401) {
          setError("Unauthorized: Please log in again.");
        } else {
          setError(err.response.data.message || "Error creating tournament");
        }
      } else {
        setError("Network error: Cannot reach the server.");
      }
    }
  }

  // --- RENDERIZADO CONDICIONAL: PANTALLA DE ÉXITO ---
  if (success) {
    return (
      <Confirmation
        title="Tournament Created!"
        message={`The tournament "${name}" is now live and ready for teams to join.`}
        subMessage={`Located in ${city}, running from ${startDate} to ${endDate}.`}
        buttonText="Go to Dashboard"
        redirectTo="/dashboard"
      />
    );
  }
  // --------------------------------------------------

  return (
    <section className={styles.centered__container}>
      <form className={styles.login__form} onSubmit={handleSubmit}>
        <h2 className={styles.form__title}>Create Tournament</h2>
        <p>Fill in the tournament details below</p>

        <div className={styles.form__input__wrapper}>
          <label className={styles.form__label} htmlFor="name">
            Tournament Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter tournament name"
            className={styles.form__input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.form__input__wrapper}>
          <label className={styles.form__label}>
            Tournament Banner (Optional)
          </label>
          <div className={styles.input__group_upload}>
            <input
              type="text"
              readOnly
              placeholder="Upload tournament banner..."
              className={styles.form__input}
              value={fileName}
              onClick={() => fileInputRef.current.click()}
              style={{ cursor: "pointer", paddingRight: "55px" }}
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

        <div className={styles.form__input__wrapper}>
          <label className={styles.form__label} htmlFor="startDate">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className={styles.form__input}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.form__input__wrapper}>
          <label className={styles.form__label} htmlFor="endDate">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className={styles.form__input}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className={styles.form__input__wrapper}>
          <label className={styles.form__label} htmlFor="city">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="e.g. Leeuwarden"
            className={styles.form__input}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
        {/* Eliminamos el texto verde de éxito porque ahora sale la nueva pantalla */}

        <Button type="submit">Save</Button>
      </form>
    </section>
  );
}

export default NewTournamentForm;
