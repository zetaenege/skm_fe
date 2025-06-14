import Button from "../common/button/Button.jsx";
import styles from "./formSteps.module.css";


function CreatedNewPassword() {
    return (

        <section className={styles.centered__container}>
            <form className={styles.login__form}>
                <h2 className={styles.form__title}>Forgot password</h2>
                <p>Please enter your <b>email address</b> to recieve a verification link.</p>


                <div>
                    <label className={styles.form__label} htmlFor="email">New Password</label>
                    <input

                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter  password"
                        className={styles.form__input}
                        required
                    />
                </div>
                <div>
                    <label className={styles.form__label} htmlFor="email">Confirm Password</label>
                    <input

                        type="password"
                        id="password"
                        name="password"
                        placeholder="Repeat password"
                        className={styles.form__input}
                        required
                    />
                </div>

                <Button type="submit">save</Button>


            </form>
        </section>
    );
}

export default CreatedNewPassword;