import style from "./StatsVieuw.module.css";
import ButtonStart from "../../common/button/ButtonStart.jsx";
import {useEffect, useState} from "react";
import {API} from "../../../Api.jsx";
import axios from "axios";


const formatDate = (dateString) => {


    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-GB', {weekday: 'short', day: 'numeric'}).toUpperCase();
    const time = date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
    return `${day} ~ ${time} h`;
}


function NextMatchLive({ tournamentId, onMatchFinished }){

    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    const [gameStatus, setGameStatus] = useState("PRE");

    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);

    useEffect(() => {
        if (!tournamentId) {
            setLoading(false);
            return;
        }

        const fetchNextMatch = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API}/matches/tournament/${tournamentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const next = res.data.find(m => m.status === "SCHEDULED");

                if (next) {
                    setMatch(next);
                    setHomeScore(next.homeScore || 0);
                    setAwayScore(next.awayScore || 0);
                } else {
                    setMatch(null);
                }


            } catch (error) {
                console.error("Error fetching next match:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNextMatch();
    }, [tournamentId]);



    const handleStart = ()=>{
        setGameStatus("LIVE");
    };

    const handleStop = ()=>{
        setGameStatus("EDIT");
    };

    const handleSaveResult = async () => {
        try {
            const token = localStorage.getItem("token");


            const updatedMatch = {
                id: match.id,
                teamHomeScore: homeScore,
                teamAwayScore: awayScore,
                status: "FINISHED"

            };

            await axios.put(`${API}/matches/${match.id}`, updatedMatch, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Match finished successfully!");


            setMatch(null);
            setGameStatus('PRE');

            if (onMatchFinished) {
                onMatchFinished();
            } else {
                window.location.reload();
            }

        } catch (error) {
            console.error("Error saving result:", error);
            alert("Failed to save result.");
        }
    };

    if (loading) {
        return <p>Loading next match...</p>;
    }

    if (!match) return null;


    return (
        <section className={style.next__match_live}>
            <article className={style.next__match_header}>

                <div>
                    <p className="text__display_tittle">Next Match</p>
                    <p className="info__text">{formatDate(match.matchDate)}</p>
                </div>

                <div>
                    <div className={style.match__state}>
                        <span className="info__text_mini">
                            {gameStatus === 'LIVE' ? '🔴 LIVE' : 'Upcoming'}
                        </span>
                    </div>
                </div>

            </article>

            <article className={style.next__match_content}>

                {/*Local Team*/}
                <div className={style.team__card}>
                    <div className={style.team__img_name}>
                        <div className={style.team__img}>
                            <img src={match.homeTeam?.imgProfile || "https://via.placeholder.com/50"} alt=""/>
                        </div>
                        <p className="text_name_small">{match.homeTeam?.name}</p>
                    </div>

                    {/* ZONA DE GOLES CAMBIANTE */}
                    <div className={style.match__result}>
                        {gameStatus === 'EDIT' ? (
                            // MODO EDICIÓN: Botones + y -
                            <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                                <button type="button" onClick={() => setHomeScore(Math.max(0, homeScore - 1))}>-
                                </button>
                                <p className="name__text">{homeScore}</p>
                                <button type="button" onClick={() => setHomeScore(homeScore + 1)}>+</button>
                            </div>
                        ) : (
                            // MODO VISUALIZACIÓN
                            <p className="name__text">{homeScore}</p>
                        )}
                    </div>
                </div>


                {/*Away Team*/}
                <div className={style.team__card}>
                    <div className={style.match__result}>
                        {gameStatus === 'EDIT' ? (
                            <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                                <button type="button" onClick={() => setAwayScore(Math.max(0, awayScore - 1))}>-
                                </button>
                                <p className="name__text">{awayScore}</p>
                                <button type="button" onClick={() => setAwayScore(awayScore + 1)}>+</button>
                            </div>
                        ) : (
                            <p className="name__text">{awayScore}</p>
                        )}
                    </div>
                    <div className={style.team__img_name}>
                        <div className={style.team__img}>
                            <img src={match.awayTeam?.imgProfile || "https://via.placeholder.com/50"} alt=""/>
                        </div>
                        <p className="text_name_small">{match.awayTeam?.name}</p>
                    </div>
                </div>
            </article>

            <div className={style.button__start}>
                {gameStatus === 'PRE' && (
                    <ButtonStart onClick={handleStart}>Start</ButtonStart>
                )}

                {gameStatus === 'LIVE' && (
                    // Aquí podrías usar un botón rojo o cambiar el estilo
                    <ButtonStart onClick={handleStop} style={{backgroundColor: 'red'}}>Stop</ButtonStart>
                )}

                {gameStatus === 'EDIT' && (
                    <ButtonStart onClick={handleSaveResult}>Add Result</ButtonStart>
                )}
            </div>

        </section>
    )
}

export default NextMatchLive;