import style from "./StatsVieuw.module.css";
import ButtonStart from "../../common/button/ButtonStart.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../Api.jsx";
import imgProfileTeam from "../../../assets/icons/img_team.svg";

function NextMatchLive() {
    const [nextMatch, setNextMatch] = useState(null);
    const [matchPhase, setMatchPhase] = useState("idle"); // idle | playing | finished
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);

    useEffect(() => {
        async function fetchMatchdayMatch() {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const headers = { Authorization: 'Bearer ${token}' };
                const tournamentsRes = await axios.get(`${API}/tournaments`, { headers });

                if (tournamentsRes.data.length === 0) return;

                const tournamentId = tournamentsRes.data[0].id;
                const matchesRes = await axios.get(`${API}/tournaments/${tournamentId}/matches/with-state`, { headers });

                const matchday = matchesRes.data.find(m => m.matchState === "Matchday");

                if (matchday) {
                    setNextMatch(matchday);
                    setHomeScore(matchday.teamHomeScore || 0);
                    setAwayScore(matchday.teamAwayScore || 0);
                }
            } catch (error) {
                console.error("❌ Error fetching Matchday match:", error);
            }
        }

        fetchMatchdayMatch();
    }, []);

    async function handleSubmitResult() {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: 'Bearer ${token}' };

            // 1. Guardar resultado + cambiar estado
            await axios.put(`${API}/matches/${nextMatch.id}`, {
                ...nextMatch,
                teamHomeScore: homeScore,
                teamAwayScore: awayScore,
                matchState: "Ended", // ✅ cambia estado del partido
            }, { headers });

            alert("✅ Resultado guardado");

            // 2. Volver a buscar el nuevo Matchday
            const tournamentsRes = await axios.get(`${API}/tournaments`, { headers });
            const tournamentId = tournamentsRes.data[0].id;
            const matchesRes = await axios.get(`${API}/tournaments/${tournamentId}/matches/with-state`, { headers });
            const matchday = matchesRes.data.find(m => m.matchState === "Matchday");

            // 3. Si hay otro matchday, cargarlo
            if (matchday) {
                setNextMatch(matchday);
                setHomeScore(matchday.teamHomeScore || 0);
                setAwayScore(matchday.teamAwayScore || 0);
                setMatchPhase("idle");
            } else {
                setNextMatch(null);
            }

        } catch (err) {
            console.error("❌ Error al guardar resultado", err);
        }
    }

    if (!nextMatch) {
        return (
            <section className={style.next__match_live}>
                <p className="info__text">No Matchday match found.</p>
            </section>
        );
    }

    return (
        <section className={style.next__match_live}>
            <article className={style.next__match_header}>
                <div>
                    <p className="text__display_tittle">Next Match</p>
                    <p className="info__text">
                        {new Date(nextMatch.matchDate).toLocaleString("en-GB", {
                            weekday: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        })} h
                    </p>
                </div>
                <div>
                    <div className={style.match__state}>
                        <span className="info__text_mini">{nextMatch.matchState}</span>
                    </div>
                </div>
            </article>

            <article className={style.next__match_content}>
                <div className={style.team__card}>
                    <div className={style.team__img_name}>
                        <div className={style.team__img}>
                            <img src={nextMatch.teamHome?.imgProfile || imgProfileTeam} alt="" />
                        </div>
                        <p className="text_name_small">{nextMatch.teamHome?.name}</p>
                    </div>
                    <div className={style.match__result}>
                        <p className="name__text">{homeScore}</p>
                    </div>
                </div>

                <div className={style.team__card}>
                    <div className={style.match__result}>
                        <p className="name__text">{awayScore}</p>
                    </div>
                    <div className={style.team__img_name}>
                        <div className={style.team__img}>
                            <img src={nextMatch.teamAway?.imgProfile || imgProfileTeam} alt="" />
                        </div>
                        <p className="text_name_small">{nextMatch.teamAway?.name}</p>
                    </div>
                </div>
            </article>

            {matchPhase === "finished" && (
                <div className={style.score__controls}>
                    <div className={style.score__team}>
                        <p className="text_name_small">{nextMatch.teamHome?.name}</p>
                        <div className={style.counter}>
                            <button onClick={() => setHomeScore(prev => Math.max(0, prev - 1))}>-</button>
                            <span>{homeScore}</span>
                            <button onClick={() => setHomeScore(prev => prev + 1)}>+</button>
                        </div>
                    </div>

                    <div className={style.score__team}>
                        <p className="text_name_small">{nextMatch.teamAway?.name}</p>
                        <div className={style.counter}>
                            <button onClick={() => setAwayScore(prev => Math.max(0, prev - 1))}>-</button>
                            <span>{awayScore}</span>
                            <button onClick={() => setAwayScore(prev => prev + 1)}>+</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={style.button__start}>
                {matchPhase === "idle" && (
                    <ButtonStart onClick={() => setMatchPhase("playing")}>Start</ButtonStart>
                )}
                {matchPhase === "playing" && (
                    <ButtonStart onClick={() => setMatchPhase("finished")}>Stop</ButtonStart>
                )}
                {matchPhase === "finished" && (
                    <ButtonStart onClick={handleSubmitResult}>Submit result</ButtonStart>
                )}
            </div>
        </section>
    );
}

export default NextMatchLive;