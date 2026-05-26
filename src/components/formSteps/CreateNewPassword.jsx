import styles from "./FormSteps.module.css";
import { useState, useContext } from "react";
import { AuthContext } from "../../assets/context/AuthContext.jsx";
import axios from "axios";
import { API } from "../../Api.jsx";
import Button from "../common/button/Button.jsx";

function CreatedNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("Nieuwe wachtwoorden komen niet overeen!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please log in.");
      return;
    }

    setLoading(true);

    try {
      const userUpdatePayload = {
        name: user?.name,
        email: user?.email,
        password: password,
        imgProfile: user?.imgProfile,
        teamId: user?.teamId ? Number(user.teamId) : null,
        isCoach: user?.isCoach || false,
        isAdmin: user?.isAdmin || false,
      };

      const response = await axios.put(
        `${API}/users/${user.id}`,
        userUpdatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setSuccessMessage("Wachtwoord succesvol gewijzigd!");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Could not update password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.centered__container}>
      <form className={styles.login__form} onSubmit={handleSubmit}>
        <h2 className={styles.form__title}>Change Password</h2>
        <p>Set a new password for your account</p>

        <div>
          <label className={styles.form__label} htmlFor="new-password">
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            placeholder="Enter password"
            className={styles.form__input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <div>
          <label className={styles.form__label} htmlFor="confirm-password">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Repeat password"
            className={styles.form__input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {error && <p className={styles.error__message}>{error}</p>}
        {successMessage && <p className={styles.success__message}>{successMessage}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </section>
  );
}

export default CreatedNewPassword;