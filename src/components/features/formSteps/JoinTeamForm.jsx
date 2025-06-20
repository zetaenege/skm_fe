import styles from "./FormSteps.module.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../assets/context/AuthContext.jsx";
import axios from "axios";
import { API } from "../../../Api.jsx";
import Button from "../../common/button/Button.jsx";

function JoinTeamForm() {
    const [position, setPosition] = useState("");
    const [selectedTeam, setSelectedTeam] = useState("");
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTeams() {
            try {
                const response = await axios.get(`${API}/teams`);
                setTeams(response.data);
            } catch (err) {
                console.error("❌ Error loading teams:", err);
                setError("Error loading teams.");
            }
        }

        void fetchTeams();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem("token");
            console.log("Team seleccionado:", selectedTeam);
            console.log("Posición:", position);


            const response = await axios.put(`${API}/users/me`, {
                name: user.name,
                teamId: Number(selectedTeam),
                position: position,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setSuccess("You've joined the team successfully!");
            setTimeout(() => navigate("/dashboarduser"), 1500);
        } catch (err) {
            console.error("❌ Error joining team:", err);
            setError("Could not join team.");
        }
    }

    return (
        <section className={styles.centered__container}>
            <form className={styles.login__form} onSubmit={handleSubmit}>
                <h2 className={styles.form__title}>Join a Team</h2>
                <p>Fill in your details below</p>

                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="position">Position</label>
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
                    <label className={styles.form__label} htmlFor="selectedTeam">Team</label>
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

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}

                <Button type="submit" children="Join a team now" />
            </form>
        </section>
    );
}

export default JoinTeamForm;