import Button from "../../common/button/Button.jsx";
import styles from "./FormSteps.module.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../../Api.jsx";
import { AuthContext } from "../../../assets/context/AuthContext.jsx";

function NewTeamForm() {
    const [name, setName] = useState('');
    const [imgProfile, setImgProfile] = useState('');
    const [city, setCity] = useState('');
    const [position, setPosition] = useState('');
    const [tournamentId, setTournamentId] = useState('');
    const [tournaments, setTournaments] = useState([]);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchTournaments() {
            try {
                const response = await axios.get(`${API}/tournaments`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTournaments(response.data);
            } catch (err) {
                console.error("❌ Error al cargar torneos:", err);
                setError("Error loading tournaments.");
            }
        }

        void fetchTournaments();
    }, [token]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const missingFields = !name || !city || !tournamentId || (!user?.isAdmin && !position);
        if (missingFields) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            const response = await axios.post(`${API}/teams`, {
                name,
                imgProfile: imgProfile || null,
                city,
                tournamentId: parseInt(tournamentId),
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const createdTeam = response.data;
            console.log("✅ Equipo creado:", createdTeam);
            setSuccess("Team created successfully!");

            // Si quisieras enviar la posición y marcar como coach manualmente, puedes hacerlo aquí
            // (aunque tu backend ya lo hace automáticamente si no es admin).

            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (err) {
            console.error("❌ Error al crear equipo:", err);
            if (err.response) {
                setError(err.response.data.message || "Error creating team");
            } else {
                setError("Error creating team");
            }
        }
    }

    return (
        <section className={styles.centered__container}>
            <form className={styles.login__form} onSubmit={handleSubmit}>
                <h2 className={styles.form__title}>Create Team</h2>
                <p>Fill in the team details below</p>

                {/* Nombre del equipo */}
                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="name">Team Name</label>
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

                {/* Posición del usuario (si no es admin) */}
                {!user?.isAdmin && (
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
                )}

                {/* Imagen */}
                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="imgProfile">Image URL (optional)</label>
                    <input
                        type="text"
                        id="imgProfile"
                        name="imgProfile"
                        placeholder="Paste an image URL"
                        className={styles.form__input}
                        value={imgProfile}
                        onChange={(e) => setImgProfile(e.target.value)}
                    />
                </div>

                {/* Ciudad */}
                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="city">City</label>
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

                {/* Torneo */}
                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="tournamentId">Tournament</label>
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

                {/* Errores y éxito */}
                {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '0.5rem' }}>{success}</p>}

                <Button type="submit">Save</Button>
            </form>
        </section>
    );
}

export default NewTeamForm;