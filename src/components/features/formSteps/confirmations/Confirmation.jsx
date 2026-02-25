import Button from "../../../common/button/Button.jsx";
import styles from "../FormSteps.module.css";
import { useNavigate } from "react-router-dom";

function Confirmation({
  title,
  message,
  subMessage,
  buttonText = "Continue",
  redirectTo,
}) {
  const navigate = useNavigate();

  return (
    <section className={styles.centered__container}>
      <div className={styles.login__form}>
        <h2 className={styles.form__title}>{title}</h2>
        <div className={styles.text__confirmation}>
          <p>{message}</p>
          {subMessage && <p>{subMessage}</p>}
        </div>

        <Button type="button" onClick={() => navigate(redirectTo)}>
          {buttonText}
        </Button>
      </div>
    </section>
  );
}

export default Confirmation;
