import Button from "../common/button/Button.jsx";
import styles from "./formSteps.module.css";


function CreatedNewPassword() {
    return (

        <section className={styles.centered__container}>
            <form className={styles.login__form}>
                <h2 className={styles.form__title}>Sign Up </h2>
                <p>Fill your information below</p>


                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="email">Name</label>
                    <input

                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        className={styles.form__input}
                        required
                    />
                </div>
                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        className={styles.form__input}
                        required
                    />
                </div>

                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="email">New Password</label>
                    <input

                        type="password"
                        id="new-password"
                        name="new-password"
                        placeholder="Enter password"
                        className={styles.form__input}
                        required
                    />
                </div>


                <div className={styles.form__input__wrapper}>
                    <label className={styles.form__label} htmlFor="email">Confirm Password</label>
                    <input

                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="Repeat password"
                        className={styles.form__input}
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
                        <span className="info__text">By creating an account or signing you agree
                    to our<a href="#"> Terms and Condititons</a></span>
                    </label>
                </div>



                <Button type="submit">save</Button>


            </form>
        </section>
    );
}

export default CreatedNewPassword;