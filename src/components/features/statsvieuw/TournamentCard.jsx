import style from "./StatsVieuw.module.css"
import Button from "../../common/button/Button.jsx";
import {useEffect, useState} from "react";
import {API} from "../../../Api.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";


function TournamentCard() {

    const [tournaments, setTournaments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchTournaments() {

            const token = localStorage.getItem("token");

            if (!token) {
                setError("No authentication token found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API}/tournaments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTournaments(Array.isArray(response.data) ? response.data : []);

            } catch (err) {
                console.error("Error fetching tournaments:", err);

                if (err.response) {
                    if (err.response.status === 401) {
                        setError("Session expired. Please log in again.");
                    } else if (err.response.status === 403) {
                        setError("Access denied. You do not have permission to view this.");
                    } else {
                        setError("Failed to load tournaments. Server error.");
                    }
                } else {
                    setError("Network error: Unable to connect to server.");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchTournaments();
    }, []);

    if (error) return <p style={{color: "red"}}>{error}</p>;
    if (loading) return <p>Loading tournaments...</p>;
    if (!tournaments.length === 0) return <p>No tournament available</p>;

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
                                    Start: {tournament.startDate
                                    ? new Date(tournament.startDate).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short"
                                    })
                                    : "TBD"}{" "}
                                    | End: {tournament.endDate
                                    ? new Date(tournament.endDate).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short"
                                    })
                                    : "TBD"}
                                </p>
                            </div>
                        </article>

                        <article>
                            <div className={style.profile_wrapper}>
                                <div className={style.img__profile}>
                                    {tournament.imgProfile ? (
                                        <img src={tournament.imgProfile} alt={tournament.name || "Tournament image"}/>
                                    ) : (
                                        <div className={style.img__placeholder}>No image</div>
                                    )}
                                </div>
                                <div className={style.profile__info}>
                                    <p className="name__text">{tournament.name || "Unnamed Tournament"}</p>
                                    <p className="info__text">{tournament.city || "Unknown location"}</p>
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
    )
}

export default TournamentCard;
