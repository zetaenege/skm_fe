import styles from "./ProfileArea.module.css";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../assets/context/AuthContext.jsx";
import axios from "axios";
import { API } from "../../../../Api.jsx";

function ProfileArea({ mode = "user", tournamentId = null }) {
    const { user } = useContext(AuthContext);
    const [teams, setTeams] = useState([]);
    const [tournamentData, setTournamentData] = useState(null);

    useEffect(() => {
        if (!user) return;

        async function loadData() {
            try {
                const token = localStorage.getItem("token");
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Carga de equipos para obtener nombres
                const resTeams = await axios.get(`${API}/teams`, config);
                setTeams(resTeams.data);

                // Carga de datos del torneo si estamos en ese modo
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

    // Lógica para decidir qué mostrar
    const isTournamentView = mode === "tournament" && tournamentData;

    return (
        <div className={styles.profile_wrapper}>
            <div className={styles.img__profile}>
                {/* Cambia la imagen según la vista */}
                <img
                    src={isTournamentView ? (tournamentData.imgProfile || "/default-tournament.png") : (user.imgProfile || "/default-avatar.png")}
                    alt="Profile"
                />
            </div>

            <div className={styles.profile__info}>
                {isTournamentView ? (
                    /* INFO DEL TORNEO */
                    <>
                        <p className="name__text">{tournamentData.name}</p>
                        <p className="info__text">
                            Start: {tournamentData.startDate
                            ? new Date(tournamentData.startDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short"
                            })
                            : "TBD"}{" "}
                            | End: {tournamentData.endDate
                            ? new Date(tournamentData.endDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short"
                            })
                            : "TBD"}
                        </p>
                        <p className="info__text">
                            <strong>{tournamentData.city || tournamentData.location || "Leeuwarden"}</strong></p>
                    </>
                ) : (
                    /* INFO  / ADMIN */
                    <>
                        <p className="name__text">{user.name || "User"}</p>
                        {user.isAdmin ? (
                            <p className="info__text">Admin access</p>
                        ) : (
                            <div>
                                {teams?.find(t => t.id === user?.teamId)?.name && (
                                    <p className="info__text">
                                        {teams.find(t => t.id === user?.teamId).name}
                                    </p>
                                )}
                                <p className="info__text">
                                    {user.position || "Waterboy"}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfileArea;