import styles from "./management.module.css";
import Button from "../../common/button/Button.jsx";

function NewMember(){
    return (
        <div className="boxGlobal">

            <p className="text__display_tittle">New Member</p>
            <p className={styles.content__text}>You’ve received a new join request from a player.</p>
            <div className={styles.request__wrapper}>
                <div className={styles.profile__wrapper}>
                    <div className={styles.img__profile}>
                        <img/>
                    </div>
                        <p className="content__text">Jonka Dagosto</p>
                </div>
                <div className={styles.button__wrapper}>
                    <Button type="submit" children="Accept " variant="requestaccept"/>
                    <Button type="submit" children="Decline "  variant="requestdecline"/>
                </div>

            </div>

        </div>
    )
}

export default NewMember;