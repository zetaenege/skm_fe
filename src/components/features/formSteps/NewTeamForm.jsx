import Button from "../../common/button/Button.jsx";
import styles from "./FormSteps.module.css";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { API } from "../../../Api.jsx";
import { AuthContext } from "../../../assets/context/AuthContext.jsx";
import { convertToBase64 } from "../../../helpers/ConvertToBase64.jsx";
import uploadIcon from "../../../assets/image/Icons/upload.svg";
// Importamos tu componente de confirmación
import Confirmation from "./confirmations/Confirmation.jsx";

function NewTeamForm() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [tournamentId, setTournamentId] = useState("");
  const [tournaments, setTournaments] = useState([]);

  // Nuevos estados para la imagen del equipo
  const [profileImage, setProfileImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // <-- Cambiado a booleano

  const { user, refreshUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API}/tournaments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📦 Torneos recibidos:", response.data);
        setTournaments(response.data);
      } catch (err) {
        console.error("Error al cargar torneos:", err);
        setError("Error loading tournaments.");
      }
    }

    void fetchTournaments();
  }, []);

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

    if (!name || !city || !tournamentId) {
      setError("Please fill in all required fields");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      return;
    }

    if (!user?.isAdmin) {
      const confirmRole = window.confirm(
        "Al crear este equipo, te convertirás automáticamente en su Coach. ¿Deseas continuar?",
      );
      if (!confirmRole) return;
    }

    try {
      let base64Image = null;
      if (profileImage) {
        base64Image = await convertToBase64(profileImage);
      }

      const response = await axios.post(
        `${API}/teams`,
        {
          name,
          imgProfile: base64Image,
          city,
          tournamentId: parseInt(tournamentId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const createdTeam = response.data;
      console.log("Team created:", createdTeam);

      // --- LÓGICA CORREGIDA PARA ACTUALIZAR AL COACH ---
      if (!user?.isAdmin && user?.id) {
        // Payload limpio para evitar la trampa de Jackson
        const userUpdatePayload = {
          name: user.name,
          email: user.email,
          position: user.position,
          imgProfile: user.imgProfile,
          teamId: createdTeam.id,
          isCoach: true, // ¡Ahora sí lo leerá Java!
          isAdmin: user.isAdmin,
        };

        await axios.put(
          `${API}/users/${user.id}`, // Usamos el endpoint directo con ID
          userUpdatePayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (refreshUser) {
          await refreshUser();
        }

        console.log("User updated as coach");
      }

      // Activamos la pantalla de éxito
      setSuccess(true);
    } catch (err) {
      console.error("Error in team creation process:", err);
      if (err.response) {
        const msg = err.response.data.message || "Error processing request";
        setError(
          err.response.status === 403
            ? "Access denied: Missing permissions."
            : msg,
        );
      } else {
        setError("Connection error. Please try again.");
      }
    }
  }

  // --- RENDERIZADO CONDICIONAL: PANTALLA DE ÉXITO ---
  if (success) {
    return (
      <Confirmation
        title="Team Created Successfully!"
        message={`Your team "${name}" is now officially registered.`}
        subMessage={
          !user?.isAdmin
            ? "You are now the official Coach. Get ready to lead them to victory!"
            : "Team added to the tournament roster."
        }
        buttonText="Go to Dashboard"
        redirectTo={user?.isAdmin ? "/dashboard" : "/dashboarduser"}
      />
    );
  }
  // --------------------------------------------------

  return (
    <section className={styles.centered__container}>
      <form className={styles.login__form} onSubmit={handleSubmit}>
        <h2 className={styles.form__title}>Create Team</h2>
        <p>Fill in the team details below</p>

        <div className={styles.form__input__wrapper}>
          <label className={styles.form__label}>Team Logo (Optional)</label>
          <div className={styles.input__group_upload}>
            <input
              type="text"
              readOnly
              placeholder="Upload team logo..."
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
          <label className={styles.form__label} htmlFor="name">
            Team Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter team name"
            className={styles.form__input}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            placeholder="Enter city"
            className={styles.form__input}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div className={styles.form__input__wrapper}>
          <label className={styles.form__label} htmlFor="tournamentId">
            Tournament
          </label>
          <select
            id="tournamentId"
            name="tournamentId"
            className={styles.form__input}
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            required
          >
            <option value="">Select a tournament</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
        {/* Eliminamos el mensaje de éxito viejo */}

        <Button type="submit">Save</Button>
      </form>
    </section>
  );
}

export default NewTeamForm;
