import Button from "../../common/button/Button.jsx";
import styles from"./management.module.css"


function NewTournament(){
    return (
        <div className="boxGlobal">

            <p className="text__display_tittle">Create  New Tournament</p>
            <p className={styles.content__text}>As an admin, you’re in charge  we’ll guide you through it!</p>
            <Button type="submit" children="New tournament"/>
        </div>
    )
}
export default NewTournament;

