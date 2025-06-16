import Button from "../../common/button/Button.jsx";
import styles from "./FormSteps.module.css";
import {useContext, useState} from "react";
import {AuthContext} from "../../../assets/context/AuthContext.jsx";
import axios from "axios";
import {Link} from "react-router-dom";

function LoginForm() {
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        console.log("Submitting login form with email:", email);

        try {
            const response = await axios.post("http://localhost:8080/api/login", {
                email,
                password,
            });

            console.log("Response from server:", response);

            if (response.data && response.data.accessToken) {
                console.log("Login successful. TOKEN:", response.data.accessToken);
                login(response.data.accessToken);
            } else {
                console.warn("No accessToken in response:", response.data);
                setError("Login failed: No token received.");
            }

        } catch (e) {
            console.error("Login error:", e);
            if (e.response) {
                console.error("Server responded with:", e.response.data);
            }
            setError("Invalid email or password");
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
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <p><Link to="/forgetpassword" className="info__text">Forgot password?</Link></p>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <Button type="submit">Sign in</Button>

                <div className={styles.link__wrapper}>
                    <p className="info__text">
                        Not a member? <Link to="/forgot-password">Register now</Link>
                    </p>
                </div>
            </form>
        </section>
    );
}

export default LoginForm;