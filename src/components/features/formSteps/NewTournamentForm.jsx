import Button from "../../common/button/Button.jsx";
import styles from "./FormSteps.module.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {API} from "../../../Api.jsx";

function NewTournamentForm() {
    const [name, setName] = useState('');
    const [imgProfile, setImgProfile] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [city, setCity] = useState('null');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

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
            const response = await axios.post(`${API}/tournaments`, {
                name,
                imgProfile: imgProfile || null,
                startDate,
                endDate,
                city,
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Tournament created:", response.data);
            setSuccess("Tournament created successfully!");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);

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

                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="city">City</label>
                    <input
                        type="text"
                        id="city"
                        name="endDate"
                        placeholder="e.g. Leeuwarden"
                        className={styles.form__input}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </div>

                {error && <p style={{color: 'red', marginTop: '0.5rem'}}>{error}</p>}
                {success && <p style={{color: 'green', marginTop: '0.5rem'}}>{success}</p>}

                <Button type="submit">Save</Button>
            </form>
        </section>
    );
}

export default NewTournamentForm;