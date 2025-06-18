import Button from "../../common/button/Button.jsx";
import styles from "./FormSteps.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../../Api.jsx";
import { useContext } from "react";
import { AuthContext } from "../../../assets/context/AuthContext.jsx";






function NewTeamForm() {


    const [position, setPosition] = useState("");
    const [name, setName] = useState('');
    const [imgProfile, setImgProfile] = useState('');
    const [city, setCity] = useState('');
    const [tournamentId, setTournamentId] = useState('');
    const [tournaments, setTournaments] = useState([]);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);





    useEffect(() => {
        async function fetchTournaments() {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(`${API}/tournaments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("📦 Torneos recibidos:", response.data); // Opcional para debug
                setTournaments(response.data);
            } catch (err) {
                console.error("❌ Error al cargar torneos:", err);
                setError("Error loading tournaments.");
            }
        }

        void fetchTournaments();
    }, []);





    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!name || !city || !tournamentId || (!user?.isAdmin && !position)) {
            setError("Please fill in all required fields");
            return;
        }
        try {
            const response = await axios.post(`${API}/teams`, {
                name,
                imgProfile: imgProfile || null,
                city,
                tournamentId: parseInt(tournamentId),
            });

            const createdTeam = response.data;
            console.log("✅ Equipo creado:", createdTeam);
            setSuccess("Team created successfully!");


            //esto es lo nuevo que ando agregando
            if (!user?.isAdmin) {
                await axios.put(`${API}/users/${user.id}`, {
                    name: user.name,
                    email: user.email,
                    teamId: createdTeam.id,
                    isCoach: true,
                    position: position,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });

                console.log("👨‍🏫 Usuario actualizado como coach y asignado al equipo");
            }
            // hasta aqui

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
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

                {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '0.5rem' }}>{success}</p>}

                <Button type="submit">Save</Button>
            </form>
        </section>
    );
}

export default NewTeamForm;