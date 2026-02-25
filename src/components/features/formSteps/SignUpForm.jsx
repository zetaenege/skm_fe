import Button from "../../common/button/Button.jsx";
import styles from "./FormSteps.module.css";
import { useState, useRef } from "react";
import axios from "axios";
import { API } from "../../../Api.jsx";
import uploadIcon from "../../../assets/image/Icons/upload.svg";
import { convertToBase64 } from "../../../helpers/ConvertToBase64.jsx";
import Confirmation from "./confirmations/Confirmation.jsx";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null); // Referencia para ocultar el input real

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setFileName(file.name); // Mostramos el nombre del archivo en el input falso
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      let base64Image = null;

      if (profileImage) {
        base64Image = await convertToBase64(profileImage);
      }

      const response = await axios.post(`${API}/users`, {
        name,
        email,
        password,
        imgProfile: base64Image,
      });

      console.log("✅ Usuario creado:", response.data);
      setSuccess(true);
    } catch (err) {
      console.error("Error al crear usuario:", err);
      if (err.response) {
        setError(err.response.data.message || "Registration failed");
      } else {
        setError("Registration failed");
      }
    }
  }

  if (success) {
    return (
      <Confirmation
        title="Welcome! Your account has been successfully created."
        message="Inside the app, you can finish setting up your team if you wish to join one or create your own."
        subMessage="We're excited to have you on board!"
        buttonText="Back to login"
        redirectTo="/"
      />
    );
  }

  return (
    <section className={styles.centered__container}>
      <form className={styles.login__form} onSubmit={handleSubmit}>
        <h2 className={styles.form__title}>Sign Up</h2>
        <p>Fill your information below</p>

        <div className={styles.form__input__wrapper}>
          <label className={styles.form__label} htmlFor="name">
            Name
          </label>
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
          <label className={styles.form__label} htmlFor="email">
            Email
          </label>
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

        {/* --- NUEVO CAMPO: UPLOAD IMAGE --- */}

        <div className={styles.form__input__wrapper}>
          <label className={styles.form__label}>Profile Image (Optional)</label>
          <div className={styles.input__group_upload}>
            {/* Input falso (Solo lectura, muestra el nombre) */}
            <input
              type="text"
              readOnly
              placeholder="Upload profile image..."
              className={styles.form__input}
              value={fileName}
              onClick={() => fileInputRef.current.click()} // Al hacer clic, abre el explorador
              style={{ cursor: "pointer", paddingRight: "55px" }} // Espacio para el botón
            />

            {/* Input REAL pero oculto */}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            {/* Botón visual idéntico al de Search */}
            <Button
              className={styles.upload__button}
              type="button"
              variant="search"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={uploadIcon}
                alt="Upload"
                className={styles.upload__icon}
              />
            </Button>
          </div>
        </div>
        {/* --------------------------------- */}

        <div className={styles.form__input__wrapper}>
          <label className={styles.form__label} htmlFor="new-password">
            New Password
          </label>
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
          <label className={styles.form__label} htmlFor="confirm-password">
            Confirm Password
          </label>
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
            <span className="info__text">
              By creating an account or signing you agree to our{" "}
              <a href="#">Terms and Conditions</a>
            </span>
          </label>
        </div>

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <Button type="submit">Save</Button>
      </form>
    </section>
  );
}

export default SignUp;
