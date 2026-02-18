import Button from "../../common/button/Button.jsx";
import styles from "./management.module.css"
import {useNavigate} from "react-router-dom";
import clsx from "clsx";


function NewTournament() {

    const navigate = useNavigate();

    function handleClick() {
        navigate("/tournaments/new");
    }


    return (
        <div className={clsx("boxGlobal", styles.new__create_trn)}>

            <p className="text__display_tittle">Create New Tournament</p>
            <p className={styles.content__text}>As an admin, you’re in charge we’ll guide you through it!</p>
            <Button
                type="submit"
                children="New tournament"
                onClick={handleClick}
            />
        </div>
    )
}

export default NewTournament;

