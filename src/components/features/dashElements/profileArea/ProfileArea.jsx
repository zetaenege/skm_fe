import styles from "./ProfileArea.module.css";
import {useContext, useState} from "react";
import {AuthContext} from "../../../../assets/context/AuthContext.jsx";
import {useEffect} from "react";
import axios from "axios";
import {API} from "../../../../Api.jsx";
import profileImg from "../../../../assets/icons/img_profile.svg"

function ProfileArea() {



    const { user } = useContext(AuthContext);
    const [teams, setTeams] = useState([]);


    // console.log("👤 Usuario logeado:", user);

    useEffect(() => {
        async function fetchTeams() {
            try {
                const response = await axios.get(`${API}/teams`);
                setTeams(response.data);
            } catch (err) {
                console.error("❌ Error al cargar equipos:", err);
            }
        }

        fetchTeams();
    }, []);

    if (!user) return <p>Cargando perfil...</p>;


    const {
        name = "Usuario",
        position = "Sin posición",
        city = "Ciudad desconocida",
        imgProfile,
        teamId,
        isAdmin,
    } = user;
    const role = isAdmin ? "ADMIN" : "USER";


    const userTeamName = teams.find(team => team.id === user.teamId)?.name || "Sin equipo";


    return (
        <div className={styles.profile_wrapper}>

            <div className={styles.img__profile}>
                 <img src={profileImg || "/default-avatar.png"} alt={`${name || "User"}'s profile`}/>
            </div>


            <div className={styles.profile__info}>
                <p className="name__text">{name}</p>
                {role === "USER" && (
                    <div>
                        <p className="info__text">
                            {userTeamName}
                        </p>
                        <p className="info__text">
                             {position || "Aguador"}
                        </p>
                    </div>
                )}


                {role === "ADMIN" && (
                    <p className="info__text">Admin environment</p>
                )}
            </div>
        </div>
    );
}

export default ProfileArea;