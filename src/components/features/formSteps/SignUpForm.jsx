import Button from "../../common/button/Button.jsx";
import styles from "./FormSteps.module.css";
import { useState } from "react";
import axios from "axios";
import { API } from "../../../Api.jsx";
import { useNavigate } from "react-router-dom";

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

        try {
            const response = await axios.post(`${API}/users`, {
                name,
                email,
                password,
            });

            console.log("✅ Usuario creado:", response.data);
            setSuccess("User created successfully!");

            // Redirige al login después de un delay
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (err) {
            console.error("❌ Error al crear usuario:", err);
            if (err.response) {
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
                    <label htmlFor="name" className={styles.form__label}>Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.form__input}
                        required
                    />
                </div>

                <div className={styles.form__input__wrapper}>
                    <label htmlFor="email" className={styles.form__label}>Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.form__input}
                        required
                    />
                </div>

                <div className={styles.form__input__wrapper}>
                    <label htmlFor="new-password" className={styles.form__label}>New Password</label>
                    <input
                        id="new-password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.form__input}
                        required
                    />
                </div>

                <div className={styles.form__input__wrapper}>
                    <label htmlFor="confirm-password" className={styles.form__label}>Confirm Password</label>
                    <input
                        id="confirm-password"
                        type="password"
                        placeholder="Repeat password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.form__input}
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
                        <span className="info__text">
                            By signing up you agree to our <a href="#">Terms and Conditions</a>
                        </span>
                    </label>
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}

                <Button type="submit">Sign Up</Button>
            </form>
        </section>
    );
}

export default SignUp;