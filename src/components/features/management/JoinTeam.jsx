import Button from "../../common/button/Button.jsx";
import styles from"./management.module.css"
import {useNavigate} from "react-router-dom";


function JoinTeam(){
    const navigate = useNavigate();
    function handleClick() {
        navigate("/user/join-team");
    }

    return (
        <div className="boxGlobal">

        <p className="text__display_tittle">Join a Team</p>
        <p className={styles.content__text}>Join an existing team by clicking here and following the steps.</p>
        <Button type="submit" children="Join a team now " onClick={handleClick}/>
        </div>
    )
}
export default JoinTeam;

