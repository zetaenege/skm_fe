import style from "./StatsVieuw.module.css"
import {useEffect, useState} from "react";
import {API} from "../../../Api.jsx";
import axios from "axios";


const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-GB', {weekday: 'short', day: 'numeric'}).toUpperCase();
    const time = date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});

    return `${day} ~ ${time} h`;

};


function UpcomingMatches({tournamentId, teamId}) {

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

                const upcoming = res.data.filter(match =>{
                    const isScheduled = match.status === "SCHEDULED";

                    const isMyTeam = teamId
                        ? (match.homeTeam?.id === teamId || match.awayTeam?.id === teamId) : true;
                    return isScheduled && isMyTeam;
            });

                setMatches(upcoming);
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
                <p className="text__display_tittle">Upcoming Matches</p>
                <p className="info__text" style={{padding: '20px', textAlign: 'center'}}>
                    No upcoming matches scheduled.
                </p>
            </div>
        );
    }


    return (


        <>
            <p className="text__display_tittle">Upcoming Matches</p>

            <section>


                    {matches.map((match) => (
                        <div key={match.id}>
                            <div className="boxGlobal">
                                <article className={style.next__match_header}>
                                    <div>
                                        <p className="info__text">{formatDate(match.matchDate)}</p>
                                    </div>
                                    <div>
                                        <div className={style.match__state}>
                                            <p className="info__text_mini">Upcoming</p>
                                        </div>
                                    </div>
                                </article>
                                <article className={style.next__match_content}>

                                    {/*Local Team*/}
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
                                            <p className="name__text">-</p>
                                        </div>
                                    </div>

                                    <div className={style.team__card}>
                                        {/*Away Team*/}
                                        <div className={style.match__result}>
                                            <p className="name__text">-</p>
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
                        </div>
                    ))}

            </section>


</>
    )
}

export default UpcomingMatches;
