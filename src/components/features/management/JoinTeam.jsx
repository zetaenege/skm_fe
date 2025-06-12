import Button from "../../common/button/Button.jsx";
import style from"./management.module.css"


function JoinTeam(){
    return (
        <div className="boxGlobal">

        <p className="text__display_tittle">Join a Team</p>
        <p className={style.content__text}>Join an existing team by clicking here and following the steps.</p>
        <Button type="submit" children="Join a team now "/>
        </div>
    )
}
export default JoinTeam;

