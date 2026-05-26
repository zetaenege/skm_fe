import Button from "../common/button/Button.jsx";
import styles from "./FormSteps.module.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../assets/context/AuthContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { API } from "../../Api.jsx";

function LoginForm() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });
      const token = response.data.jwt;

      if (token) {
        if (typeof login === "function") {
          login(token);
        } else {
          console.error("'login' is not a function", login);
          setError("Internal error: login function missing.");
        }
      } else {
        console.warn("No token received");
        setError("Login failed: No token received.");
      }
    } catch (e) {
      console.error("Login error:", e);
      setError("Network error: Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={`animate__page_enter ${styles.centered__container}`}>
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
            disabled={loading}
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
            disabled={loading}
            required
          />
        </div>

        <p>
          <Link to="/forgetpassword" className="info__text">
            Forgot password?
          </Link>
        </p>

        {error && <p className={styles.error__message}>{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>

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