

import style from "./StatsVieuw.module.css"
import {useEffect, useState} from "react";
import axios from "axios";
import {API} from "../../../Api.jsx";


const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-GB', {weekday: 'short', day: 'numeric'}).toUpperCase();
    const time = date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});

    return `${day} ~ ${time} h`;

};


function PastMatches({ tournamentId, teamId }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {


        if (!tournamentId) return;
        console.log("🕵️‍♂️ Debug PastMatches - TournamentID:", tournamentId, "TeamID:", teamId);

        const fetchMatches = async () => {
            try {

                const token = localStorage.getItem("token");
                const res = await axios.get(`${API}/matches/tournament/${tournamentId}`, {
                    headers: {Authorization: `Bearer ${token}`}
                });

                const finishedMatches = res.data.filter(match => {
                    const isFinished = match.status === "FINISHED";
                    const isMyTeam = teamId
                        ? (String(match.homeTeam?.id) === String(teamId) || String(match.awayTeam?.id) === String(teamId))
                        : true;

                    return isFinished && isMyTeam;
                });


                finishedMatches.reverse();
                setMatches(finishedMatches);


            } catch (error) {
                console.error("Error cargando partidos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();

    }, [tournamentId, teamId]);
    if (loading) {
        return <p>Loading upcoming matches...</p>;
    }
    if (matches.length === 0) {
        return (
            <div className="boxGlobal">
                <p className="text__display_tittle">Past Matches</p>
                <p className="info__text" style={{padding: '20px', textAlign: 'center'}}>
                    No results recorded yet.
                </p>
            </div>
        );
    }
    return (
        <>
            <p className="text__display_tittle">Past Matches</p>

            <section>
                {matches.map((match) => (
                    // Usamos boxGlobal aquí dentro para separar cada tarjeta
                    <div key={match.id} className="boxGlobal" style={{ marginBottom: '20px' }}>

                        <article className={style.next__match_header}>
                            <div>
                                <p className="info__text">{formatDate(match.matchDate)}</p>
                            </div>
                            <div>
                                <div className={style.match__state}>
                                    {/* Cambiamos el texto a Finished */}
                                    <p className="info__text_mini" style={{color: '#aaa'}}>Finished</p>
                                </div>
                            </div>
                        </article>

                        <article className={style.next__match_content}>

                            {/* Equipo Local */}
                            <div className={style.team__card}>
                                <div className={style.team__img_name}>
                                    <div className={style.team__img}>
                                        <img
                                            src={match.homeTeam?.imgProfile || "https://via.placeholder.com/50"}
                                            alt={match.homeTeam?.name}
                                        />
                                    </div>
                                    <p className="text_name_small">{match.homeTeam?.name}</p>
                                </div>
                                <div className={style.match__result}>
                                    {/* Mostramos el GOL real */}
                                    <p className="name__text">{match.homeScore ?? match.teamHomeScore ?? 0}</p>
                                </div>
                            </div>

                            {/* Equipo Visitante */}
                            <div className={style.team__card}>
                                <div className={style.match__result}>
                                    {/* Mostramos el GOL real */}
                                    <p className="name__text">{match.awayScore ?? match.teamAwayScore ?? 0}</p>
                                </div>
                                <div className={style.team__img_name}>
                                    <div className={style.team__img}>
                                        <img
                                            src={match.awayTeam?.imgProfile || "https://via.placeholder.com/50"}
                                            alt={match.awayTeam?.name}
                                        />
                                    </div>
                                    <p className="text_name_small">{match.awayTeam?.name}</p>
                                </div>
                            </div>

                        </article>
                    </div>
                ))}
            </section>
        </>
    );
}

export default PastMatches;
