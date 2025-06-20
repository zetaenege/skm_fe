import Button from "../../common/button/Button.jsx";
import styles from "./FormSteps.module.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../../Api.jsx";
import { AuthContext } from "../../../assets/context/AuthContext.jsx"; // asegúrate de que esté bien la ruta

function NewTournamentForm() {
    const [name, setName] = useState('');
    const [imgProfile, setImgProfile] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();
    const { user, isAuth } = useContext(AuthContext);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!isAuth) {
            setError("You must be logged in to create a tournament.");
            return;
        }

        if (!name || !startDate || !endDate) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(`${API}/tournaments`, {
                name,
                imgProfile: imgProfile || null,
                startDate,
                endDate,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Torneo creado:", response.data);
            setSuccess("Tournament created successfully!");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);

        } catch (err) {
            console.error("❌ Error al crear torneo:", err);
            if (err.response) {
                setError(err.response.data.message || "Error creating tournament");
            } else {
                setError("Error creating tournament");
            }
        }
    }

    return (
        <section className={styles.centered__container}>
            <form className={styles.login__form} onSubmit={handleSubmit}>
                <h2 className={styles.form__title}>Create Tournament</h2>
                <p>Fill in the tournament details below</p>

                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="name">Tournament Name</label>
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
                    <label className={styles.form__label} htmlFor="startDate">Start Date</label>
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
                    <label className={styles.form__label} htmlFor="endDate">End Date</label>
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

                {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '0.5rem' }}>{success}</p>}

                <Button type="submit">Save</Button>
            </form>
        </section>
    );
}

export default NewTournamentForm;