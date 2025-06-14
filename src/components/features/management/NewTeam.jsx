import Button from "../../common/button/Button.jsx";
import styles from"./management.module.css"


function NewTeam(){
    return (
        <div className="boxGlobal">

            <p className="text__display_tittle">Create  New Team</p>
            <p className={styles.content__text}>Thinking of starting your own team?
                we’ll guide you through it!</p>
            <Button type="submit" children="Create new team"/>
        </div>
    )
}
export default NewTeam;

