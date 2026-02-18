import styles from "./ProfileArea.module.css";
import {useContext, useState, useEffect} from "react";
import {AuthContext} from "../../../../assets/context/AuthContext.jsx";
import axios from "axios";
import {API} from "../../../../Api.jsx";

// Importamos los iconos para el Plan B
import tournamentCup from "../../../../assets/icons/img_tournament.svg";
import userProfile from "../../../../assets/image/Profile/user_Profile.svg";
import style from "../../statsvieuw/StatsVieuw.module.css";

function ProfileArea({mode = "user", tournamentId = null}) {
    const {user} = useContext(AuthContext);
    const [teams, setTeams] = useState([]);
    const [tournamentData, setTournamentData] = useState(null);
    const isAdmin = user?.isAdmin === true;
    const currentVariant = isAdmin ? "admin" : mode;
    const isTournament = mode === "tournament" && tournamentData;
    const hasPhoto = isTournament ? tournamentData?.imgProfile : user?.imgProfile;


    // Definimos qué clase de color usar según el modo (definidas en el CSS)
    const variantClass = styles[`variant_${mode}`] || styles.variant_user;

    useEffect(() => {
        if (!user) return;

        async function loadData() {
            try {
                const token = localStorage.getItem("token");
                const config = {headers: {Authorization: `Bearer ${token}`}};

                const resTeams = await axios.get(`${API}/teams`, config);
                setTeams(resTeams.data);

                const tId = tournamentId || user?.tournamentId;
                if (mode === "tournament" && tId) {
                    const resTour = await axios.get(`${API}/tournaments/${tId}`, config);
                    setTournamentData(resTour.data);
                }
            } catch (err) {
                console.error("Error loading ProfileArea data:", err);
            }
        }

        loadData();
    }, [user, tournamentId, mode]);
    if (!user) return <p>Cargando perfil...</p>;


    return (
        <div className={styles.profile_wrapper}>
            {/* El div circular ahora recibe su color por una clase CSS de variante */}
            <div className={`${styles.img__profile} ${variantClass}`}>

                {hasPhoto ? (
                    <img
                        src={isTournament ? tournamentData?.imgProfile : user?.imgProfile}
                        alt="Profile"
                        className={styles.real_image}
                    />
                ) : (
                    <>

                        {isTournament ? (
                            <img
                                src={tournamentCup}
                                alt="Tournament Icon"
                                className={styles.placeholder_icon}
                            />
                        ) : isAdmin ? (
                            <div className={styles.user__svg_icon}></div>
                        ) : (
                            // CASO 3: Ni torneo ni Admin -> Icono de usuario normal
                            <img
                                src={userProfile}
                                alt="User Icon"
                                className={styles.placeholder_icon}
                            />
                        )}
                    </>
                )}
            </div>

            <div className={styles.profile__info}>
                {isTournament ? (
                    <>
                        <p className="name__text">{tournamentData.name}</p>
                        <p className="info__text">
                            <span className={style.day__strong}>Start:</span>{" "}
                            {tournamentData.startDate
                                ? new Date(tournamentData.startDate).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                })
                                : "TBD"}{" "}
                            |{" "}
                            <span className={style.day__strong}>End:</span>{" "}
                            {tournamentData.endDate
                                ? new Date(tournamentData.endDate).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                })
                                : "TBD"}
                        </p>
                        <p className="info__text">{tournamentData.city || "Leeuwarden"}</p>
                    </>
                ) : (
                    <>
                        <p className="name__text">{user.name || "User"}</p>
                        {isAdmin ? (
                            <p className="info__text">Admin access</p>
                        ) : (
                            < >
                                <p className="info__text">{user.position || "Player"}</p>
                                <p className="info__text">
                                    {teams?.find(t => t.id === user?.teamId)?.name || "No Team"}
                                </p>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfileArea;