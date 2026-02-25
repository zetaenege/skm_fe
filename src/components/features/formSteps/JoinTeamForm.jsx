import styles from "./FormSteps.module.css";
import { useState, useEffect, useContext } from "react";
// Importamos tu componente de confirmación
import Confirmation from "./confirmations/Confirmation.jsx";
import { AuthContext } from "../../../assets/context/AuthContext.jsx";
import axios from "axios";
import { API } from "../../../Api.jsx";
import Button from "../../common/button/Button.jsx";

function JoinTeamForm() {
  const [position, setPosition] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // Cambiado a booleano

  // Extraemos también refreshUser para actualizar la app globalmente
  const { user, refreshUser } = useContext(AuthContext);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API}/teams`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTeams(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error loading teams:", err);
        setError("Error loading teams list.");
      }
    }

    void fetchTeams();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please log in.");
      return;
    }

    try {
      // 1. Creamos el payload exacto para evitar errores de DTO en Spring Boot
      const userUpdatePayload = {
        name: user.name,
        email: user.email,
        position: position, // La posición que acaba de escribir
        imgProfile: user.imgProfile,
        teamId: Number(selectedTeam), // El equipo al que se une
        isCoach: false, // Al unirse NO es coach
        isAdmin: user.isAdmin, // Mantenemos su rol original
      };

      // 2. Usamos la ruta con el ID exacto, igual que en NewTeamForm
      const response = await axios.put(
        `${API}/users/${user.id}`,
        userUpdatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("✅ Joined team:", response.data);

      // 3. Actualizamos el usuario global en React para que el ProfileArea se entere
      if (refreshUser) {
        await refreshUser();
      }

      // 4. Activamos la pantalla de confirmación
      setSuccess(true);
    } catch (err) {
      console.error("Error joining team:", err);
      if (err.response && err.response.status === 403) {
        setError(
          "Permission denied (403). Your role might not allow this update.",
        );
      } else {
        setError("Could not join team.");
      }
    }
  }

  // --- RENDERIZADO CONDICIONAL: LA PANTALLA DE ÉXITO ---
  if (success) {
    // Buscamos el nombre del equipo para hacerlo más personalizado
    const joinedTeamName =
      teams.find((t) => t.id === Number(selectedTeam))?.name || "your new team";

    return (
      <Confirmation
        title="Welcome to the Team!"
        message={`You have successfully joined ${joinedTeamName} as a ${position}.`}
        subMessage="Get ready for the upcoming matches!"
        buttonText="Go to Dashboard"
        redirectTo="/dashboarduser"
      />
    );
  }
  // -----------------------------------------------------

  return (
    <section className={styles.centered__container}>
      <form className={styles.login__form} onSubmit={handleSubmit}>
        <h2 className={styles.form__title}>Join a Team</h2>
        <p>Fill in your details below</p>

        <div className={styles.form__input__wrapper}>
          <label className={styles.form__label} htmlFor="position">
            Position
          </label>
          <input
            type="text"
            id="position"
            name="position"
            placeholder="Enter your position"
            className={styles.form__input}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>

        <div className={styles.form__input__wrapper}>
          <label className={styles.form__label} htmlFor="selectedTeam">
            Team
          </label>
          <select
            id="selectedTeam"
            name="selectedTeam"
            className={styles.form__input}
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            required
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
        {/* Eliminamos el mensaje de texto verde porque ahora usamos el componente Confirmation */}

        {/* Pequeña corrección de sintaxis en el botón */}
        <Button type="submit">Join a team now</Button>
      </form>
    </section>
  );
}

export default JoinTeamForm;
