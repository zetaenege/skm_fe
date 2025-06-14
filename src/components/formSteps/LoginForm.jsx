import Button from "../common/button/Button.jsx";
import styles from "./formSteps.module.css";


function LoginForm() {
    return (

        <section className={styles.centered__container}>
            <form className={styles.login__form}>
                <h2 className={styles.form__title}>Welcome!</h2>

                <div>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        className={styles.form__input}
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
                        required
                    />
                </div>

                <p><a href="#" className="info__text">Forgot password?</a></p>

                <Button type="submit">Sign in</Button>

                <div className={styles.link__wrapper}>
                    <p className="info__text">
                        Not a member? <a href="#" className={styles.link}>Register now</a>
                    </p>
                </div>
            </form>
        </section>
    );
}

export default LoginForm;