import style from "./StatsVieuw.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../Api.jsx";
import Button from "../../common/button/Button.jsx";
import imgProfileTeam from "../../../assets/icons/img_team.svg";

function UpcomingMatches() {
    const [matches, setMatches] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        async function fetchTournamentMatches() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.warn("❌ No token found");
                    return;
                }

                const headers = { Authorization: `Bearer ${token}` };

                const tournamentsRes = await axios.get(`${API}/tournaments`, { headers });
                if (tournamentsRes.data.length === 0) {
                    console.warn("❌ No tournaments found");
                    return;
                }

                const tournamentId = tournamentsRes.data[0].id;

                const matchesRes = await axios.get(
                    `${API}/tournaments/${tournamentId}/matches/with-state`,
                    { headers }
                );

                console.log("📦 Partidos recibidos:", matchesRes.data);
                setMatches(matchesRes.data);
            } catch (error) {
                console.error("❌ Error al cargar partidos del torneo:", error);
            }
        }

        fetchTournamentMatches();
    }, []);

    const displayedMatches = showAll ? matches : matches.slice(0, 6);


    return (
        <>
            <p className="text__display_tittle">Upcoming Matches</p>

            {matches.length > 0 ? (
                <>
                    <div className={style.match__grid}>
                        {displayedMatches.map((match) => (
                            <div className="boxGlobal" key={match.id}>
                                <section>
                                    <article className={style.next__match_header}>
                                        <div>
                                            <p className="info__text">
                                                {new Date(match.matchDate).toLocaleString("en-GB", {
                                                    weekday: "short",
                                                    day: "2-digit",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}{" "}
                                                h
                                            </p>
                                        </div>
                                        <div>
                                            <div className={style.match__state}>
                                                <p className="info__text_mini">{match.matchState}</p>
                                            </div>
                                        </div>
                                    </article>
                                    <article className={style.next__match_content}>
                                        <div className={style.team__card}>
                                            <div className={style.team__img_name}>
                                                <div className={style.team__img}>
                                                    <img
                                                        src={match.teamHome?.imgProfile || imgProfileTeam}
                                                        alt=""
                                                    />
                                                </div>
                                                <p className="text_name_small">{match.teamHome?.name}</p>
                                            </div>
                                            <div className={style.match__result}>
                                                <p className="name__text">{match.teamHomeScore}</p>
                                            </div>
                                        </div>
                                        <div className={style.team__card}>
                                            <div className={style.match__result}>
                                                <p className="name__text">{match.teamAwayScore}</p>
                                            </div>
                                            <div className={style.team__img_name}>
                                                <div className={style.team__img}>
                                                    <img
                                                        src={match.teamAway?.imgProfile || imgProfileTeam}
                                                        alt=""
                                                    />
                                                </div>
                                                <p className="text_name_small">{match.teamAway?.name}</p>
                                            </div>
                                        </div>
                                    </article>
                                </section>
                            </div>
                        ))}
                    </div>

                    {matches.length > 6 && (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <Button variant="requestaccept" onClick={() => setShowAll(!showAll)}>
                                {showAll ? "Show less" : "See more"}
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <p className="info__text">No upcoming matches found.</p>
            )}
        </>
    );
}

export default UpcomingMatches;