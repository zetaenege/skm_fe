import style from "./StatsVieuw.module.css";
import Button from "../../common/button/Button.jsx";
import { useEffect, useState } from "react";
import { API } from "../../../Api.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import tournamentCup from "../../../assets/image/Icons/tournament.svg";
import TournamentCardInfo from "../dashElements/tournamentProfileInfo/TournamentCardInfo.jsx";

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

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (loading) return <p>Loading tournaments...</p>;
  if (tournaments.length === 0) {
    return (
      <div className="boxGlobal">
        <p className="info__text">No tournaments available yet.</p>
      </div>
    );
  }

  return (
    <>
      <p className="text__display_tittle section__tittle">Tournament</p>
      <div className={style.tournament__card_container}>
        {tournaments.map((tournament) => (
          <div className="boxGlobal" key={tournament.id}>
            <section className={style.tournament__card}>
              <article className={style.next__match_header}>
                <div className={style.img__profile}>
                  <img
                    src={tournament.imgProfile || tournamentCup}
                    alt={tournament.name || "Tournament image"}
                    className={
                      !tournament.imgProfile
                        ? style.icon__style
                        : style.full__img
                    }
                  />
                </div>

                <div>
                  <p className="info__text">TRM{tournament.id || "N/A"}</p>
                </div>
              </article>

              <article>
                <div className={style.profile_wrapper}>
                  <div className={style.profile__info}>
                    <p className="name__text">
                      {tournament.name || "Unnamed Tournament"}
                    </p>
                    <p className="info__text">
                      <strong>City:</strong>{" "}
                      {tournament.city || "Unknown location"}
                    </p>
                    <div>
                      <p className="info__text">
                        <strong>Start:</strong>{" "}
                        {tournament.startDate
                          ? new Date(tournament.startDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                              },
                            )
                          : "TBD"}{" "}
                        - <strong>End:</strong>{" "}
                        {tournament.endDate
                          ? new Date(tournament.endDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                              },
                            )
                          : "TBD"}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
              <article>
                <TournamentCardInfo
                  variant="light"
                  tournamentId={tournament.id} // <--- AÑADE ESTO
                  tournamentData={tournament}
                />
              </article>

              <Button
                type="button"
                variant="primary" // Usamos tu variante standard
                onClick={() =>
                  navigate(`/dashboard/tournament/${tournament.id}`)
                }
              >
                Manage Tournament
              </Button>
            </section>
          </div>
        ))}
      </div>
    </>
  );
}

export default TournamentCard;
