import styles from "./FormSteps.module.css";
import { useState, useEffect, useContext } from "react";
import Confirmation from "./confirmations/Confirmation.jsx";
import { AuthContext } from "../../assets/context/AuthContext.jsx";
import axios from "axios";
import { API } from "../../Api.jsx";
import Button from "../common/button/Button.jsx";

function JoinTeamForm() {
  const [position, setPosition] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useContext(AuthContext);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTeams() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API}/teams`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTeams(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error loading teams:", err);
          setError("Error loading teams list.");
        }
      }
    }

    void fetchTeams();

    return () => {
      controller.abort();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const userUpdatePayload = {
        name: user.name,
        email: user.email,
        position: position,
        imgProfile: user.imgProfile,
        teamId: Number(selectedTeam),
        isCoach: false,
        isAdmin: user.isAdmin,
      };

      await axios.put(
        `${API}/users/${user.id}`,
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
      setSuccess(true);
    } catch (err) {
      console.error("Error joining team:", err);
      if (err.response && err.response.status === 403) {
        setError("Permission denied (403). Your role might not allow this update.");
      } else {
        setError("Could not join team.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    const joinedTeamName = teams.find((t) => t.id === Number(selectedTeam))?.name || "your new team";

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
            disabled={loading}
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
            disabled={loading}
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

        {error && <p className={styles.error__message}>{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Joining..." : "Join a team now"}
        </Button>
      </form>
    </section>
  );
}

export default JoinTeamForm;