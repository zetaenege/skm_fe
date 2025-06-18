import Button from "../../common/button/Button.jsx";
import styles from "./FormSteps.module.css";
import { useState } from "react";
import axios from "axios";
import {API} from "../../../Api.jsx";
import {useNavigate} from "react-router-dom";






function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();


    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        console.log("Enviando registro con:", { name, email, password });

        try {
            const response = await axios.post(`${API}/users`, {
                name,
                email,
                password
            });

            console.log("✅ Usuario creado:", response.data);
            setSuccess("User created successfully!");

            // Redirige al login después de un pequeño delay
            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (err) {
            console.error( "Error al crear usuario:", err);
            if (err.response) {
                console.error(" Respuesta del servidor con error:", err.response.data);
                setError(err.response.data.message || "Registration failed");
            } else {
                setError("Registration failed");
            }
        }
    }

    return (
        <section className={styles.centered__container}>
            <form className={styles.login__form} onSubmit={handleSubmit}>
                <h2 className={styles.form__title}>Sign Up</h2>
                <p>Fill your information below</p>

                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        className={styles.form__input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        className={styles.form__input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="new-password">New Password</label>
                    <input
                        type="password"
                        id="new-password"
                        name="new-password"
                        placeholder="Enter password"
                        className={styles.form__input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="Repeat password"
                        className={styles.form__input}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.form__checkbox__wrapper}>
                    <label className={styles.form__checkbox__label}>
                        <input
                            type="checkbox"
                            name="terms"
                            required
                            className={styles.custom__checkbox}
                        />
                        <span className="info__text">By creating an account or signing you agree
                            to our <a href="#">Terms and Conditions</a></span>
                    </label>
                </div>

                {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '0.5rem' }}>{success}</p>}

                <Button type="submit">Save</Button>
            </form>
        </section>
    );
}

export default SignUp;