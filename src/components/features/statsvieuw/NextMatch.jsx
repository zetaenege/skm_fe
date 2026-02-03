import style from "./StatsVieuw.module.css";
import Button from "../../common/button/Button.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {API} from "../../../Api.jsx";


const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }).toUpperCase();
    const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return `${day} ~ ${time} h`;
};

function NextMatch({ tournamentId, teamId }) {

    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!tournamentId) return;

        const fetchNextMatch = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API}/matches/tournament/${tournamentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // LÓGICA DE FILTRADO PARA EL USUARIO:
                // 1. Buscamos partidos que estén programados (SCHEDULED)
                // 2. Si tenemos teamId, nos aseguramos que sea NUESTRO partido.
                const myNextMatch = res.data.find(m => {
                    const isScheduled = m.status === "SCHEDULED";
                    const isMyTeam = teamId
                        ? (String(m.homeTeam?.id) === String(teamId) || String(m.awayTeam?.id) === String(teamId))
                        : true; // Si no hay teamId, muestra el primero cualquiera del torneo

                    return isScheduled && isMyTeam;
                });

                setMatch(myNextMatch || null);

            } catch (error) {
                console.error("Error fetching next match:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNextMatch();
    }, [tournamentId, teamId]);

    // Si está cargando o no hay partido próximo, mostramos un mensaje o nada
    if (loading) return <p className="info__text">Loading...</p>;

    if (!match) {
        return (
            <section className={style.next__match}>
                <p className="info__text" style={{padding: '20px', textAlign: 'center'}}>
                    No upcoming match scheduled.
                </p>
            </section>
        );
    }

    return (
        <section className={style.next__match}>
            <article className={style.next__match_header}>
                <div>
                    <p className="text__display_tittle">Next Match</p>
                    <p className="info__text">{formatDate(match.matchDate)}</p>
                </div>

                <div>
                    <div className={style.match__state}>
                        <p className="info__text_mini">Upcoming</p>
                    </div>
                </div>
            </article>

            <article className={style.next__match_content}>
                {/* Equipo Local */}
                <div className={style.team__card}>
                    <div className={style.team__img_name}>
                        <div className={style.team__img}>
                            <img src={match.homeTeam?.imgProfile || "https://via.placeholder.com/50"} alt={match.homeTeam?.name} />
                        </div>
                        {/* Resaltamos si es mi equipo */}
                        <p className="text_name_small" style={{color: String(match.homeTeam?.id) === String(teamId) ? '#e94560' : 'white'}}>
                            {match.homeTeam?.name}
                        </p>
                    </div>
                    <div className={style.match__result}>
                        <p className="name__text">0</p>
                    </div>
                </div>

                {/* Equipo Visitante */}
                <div className={style.team__card}>
                    <div className={style.match__result}>
                        <p className="name__text">0</p>
                    </div>
                    <div className={style.team__img_name}>
                        <div className={style.team__img}>
                            <img src={match.awayTeam?.imgProfile || "https://via.placeholder.com/50"} alt={match.awayTeam?.name} />
                        </div>
                        {/* Resaltamos si es mi equipo */}
                        <p className="text_name_small" style={{color: String(match.awayTeam?.id) === String(teamId) ? '#e94560' : 'white'}}>
                            {match.awayTeam?.name}
                        </p>
                    </div>
                </div>
            </article>
        </section>
    );
}

export default NextMatch;