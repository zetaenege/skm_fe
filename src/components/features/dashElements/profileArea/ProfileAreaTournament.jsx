import styles from "./ProfileArea.module.css";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../assets/context/AuthContext.jsx";
import axios from "axios";
import { API } from "../../../../Api.jsx";
import defaultTournamentImg from "../../../../assets/icons/organisatoricon.svg";

function ProfileAreaTournament() {
    const { user } = useContext(AuthContext);
    const [tournament, setTournament] = useState(null);

    useEffect(() => {
        async function fetchTournaments() {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get(`${API}/tournaments`, { headers });

                if (response.data.length > 0) {
                    setTournament(response.data[0]); // 👈 Puedes cambiar el índice si quieres otro
                }
            } catch (err) {
                console.error("❌ Error al cargar torneos:", err);
            }
        }

        if (user?.isAdmin) {
            fetchTournaments();
        }
    }, [user]);

    if (!user || !tournament) return <p>Cargando torneo...</p>;

    const tournamentName = tournament.name || "Torneo desconocido";
    const tournamentImg = tournament.imgProfile || defaultTournamentImg;
    const tournamentStart = tournament.startDate?.slice(5, 10).replace("-", "/") || "Sin fecha";
    const tournamentEnd = tournament.endDate?.slice(5, 10).replace("-", "/") || "Sin fecha";

    return (
        <div className={styles.profile_wrapper}>
            <div className={styles.img__profile}>
                <img
                    src={tournamentImg}
                    alt={`Imagen de ${tournamentName}`}
                    className={styles.img__tournament}
                />
            </div>

            <div className={styles.profile__info}>
                <p className="name__text">{tournamentName}</p>
                <p className="info__text">{tournamentStart} - {tournamentEnd}</p>
            </div>
        </div>


    );
}

export default ProfileAreaTournament;