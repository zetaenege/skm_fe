import style from "./management.module.css";
import Button from "../../common/button/Button.jsx";

function NewMember(){
    return (
        <div className="boxGlobal">

            <p className="text__display_tittle">New Member</p>
            <p className={style.content__text}>You’ve received a new join request from a player.</p>
            <Button type="submit" children="Join a team now "/>
        </div>
    )
}
export default NewMember;