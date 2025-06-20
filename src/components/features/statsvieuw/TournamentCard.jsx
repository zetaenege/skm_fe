import style from "./StatsVieuw.module.css";
import Button from "../../common/button/Button.jsx";
import { useEffect, useState } from "react";
import { API } from "../../../Api.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import imgTournament from "../../../assets/icons/organisatoricon.svg"

function TournamentCard() {
    const [tournaments, setTournaments] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTournaments() {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API}/tournaments`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTournaments(response.data);
            } catch (err) {
                console.error("❌ Error al obtener torneos:", err);
                setError("Failed to load tournaments.");
            }
        }

        fetchTournaments();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "TBD";
        const date = new Date(dateStr);
        return isNaN(date) ? "TBD" : date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short"
        });
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!Array.isArray(tournaments)) return <p>Invalid tournament data.</p>;
    if (!tournaments.length) return <p>Loading tournaments...</p>;

    return (
        <>
            {tournaments.map((tournament) => (
                <div className="boxGlobal" key={tournament.id}>
                    <section className={style.tournament__card}>
                        <article className={style.next__match_header}>
                            <div>
                                <p className="text__display_tittle_mini">
                                    Tournament #{tournament.id || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="info__text">
                                    Start: {formatDate(tournament.startDate)} | End: {formatDate(tournament.endDate)}
                                </p>
                            </div>
                        </article>

                        <article>
                            <div className={style.profile_wrapper}>
                                <div className={style.img__profile}>

                                    {tournament.imgProfile ? (
                                    <img
                                        src={tournament.imgProfile}
                                        alt={tournament.name || "Tournament image"}
                                        className={style.img__tournament_list}
                                    />
                                ) : (
                                    <img
                                        src={imgTournament}
                                        alt="Default tournament image"
                                        className={style.img__tournament_list}
                                    />
                                )}

                                </div>
                                <div className={style.profile__info}>
                                    <p className="name__text">{tournament.name || "Unnamed Tournament"}</p>
                                </div>
                            </div>
                        </article>

                        <Button
                            type="button"
                            onClick={() => navigate(`/dashboard/tournament/${tournament.id}`)}
                        >
                            Manage Tournament
                        </Button>
                    </section>
                </div>
            ))}
        </>
    );
}

export default TournamentCard;