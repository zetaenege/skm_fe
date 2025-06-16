import Button from "../../common/button/Button.jsx";
import styles from "./FormSteps.module.css";


function ForgotPassword() {
    return (

        <section className={styles.centered__container}>
            <form className={styles.login__form}>
                <h2 className={styles.form__title}>Forgot password</h2>
                <p>Please enter your <b>email address</b> to recieve a verification link.</p>

                <div>
                    <label className={styles.form__label} htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        className={styles.form__input}
                        required
                    />
                </div>



                <Button type="submit">Send</Button>


            </form>
        </section>
    );
}

export default ForgotPassword;