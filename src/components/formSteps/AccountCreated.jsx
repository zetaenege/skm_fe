import Button from "../common/button/Button.jsx";
import styles from "./formSteps.module.css";


function AccountCreated() {
    return (

        <section className={styles.centered__container}>
            <form className={styles.login__form}>
                <h2 className={styles.form__title}>Welcome!
                    Your account has been successfully created.</h2>
                <p>Inside the app, you can finish setting up your team if you wish to join one or create your own.
                    </p>
                <p>We're excited to have you on board!</p>




                <Button type="submit">Back to login</Button>


            </form>
        </section>
    );
}

export default AccountCreated;