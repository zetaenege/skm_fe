import Button from "../../common/button/Button.jsx";
import styles from "./FormSteps.module.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../../assets/context/AuthContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { API } from "../../../Api.jsx";

function LoginForm() {
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(`${API}/login`, { email, password });

            if (response.data?.accessToken) {
                console.log("✅ Login successful");
                if (typeof login === "function") {
                    login(response.data.accessToken);
                } else {
                    console.error("❌ 'login' is not a function", login);
                    setError("Internal error: login function missing.");
                }
            } else {
                console.warn("⚠️ No token received");
                setError("Login failed: No token received.");
            }

        } catch (e) {
            console.error("❌ Login error:", e);
            if (e.response?.data?.message) {
                setError(e.response.data.message);
            } else {
                setError("Login failed. Please try again.");
            }
        }
    }

    return (
        <section className={styles.centered__container}>
            <form className={styles.login__form} onSubmit={handleSubmit}>
                <h2 className={styles.form__title}>Welcome!</h2>

                <div>
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

                <div>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        className={styles.form__input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <p>
                    <Link to="/forgetpassword" className="info__text">
                        Forgot password?
                    </Link>
                </p>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <Button type="submit">Sign in</Button>

                <div className={styles.link__wrapper}>
                    <p className="info__text">
                        Not a member? <Link to="/register">Register now</Link>
                    </p>
                </div>
            </form>
        </section>
    );
}

export default LoginForm;