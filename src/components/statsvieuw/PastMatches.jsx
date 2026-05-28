import style from "./StatsVieuw.module.css";
import { useEffect, useState } from "react";
import { API } from "../../Api.jsx";
import teamImg from "../../assets/image/Icons/team.svg";
import matchEnd from "../../assets/icons/matchEnd.svg";
import Button from "../common/button/Button.jsx";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = date
    .toLocaleDateString("en-GB", { weekday: "short", day: "numeric" })
    .toUpperCase();
  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <span className={style.day__strong}>{day}</span> ~ {time} h
    </>
  );
};

function PastMatches({ tournamentId, teamId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(2);
  const BRAND_COLORS = [
    "var(--color-aqua)",
    "var(--color-lemon)",
    "var(--color-rosa)",
    "var(--color-violet)",
  ];

  useEffect(() => {
    if (!tournamentId) return;


    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(
          `/matches/tournament/${tournamentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const finishedMatches = res.data.filter((match) => {
          const isFinished = match.status === "FINISHED";
          const isMyTeam = teamId
            ? String(match.homeTeam?.id) === String(teamId) ||
              String(match.awayTeam?.id) === String(teamId)
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

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 2);
  };

  if (loading) {
    return <p>Loading upcoming matches...</p>;
  }
  if (matches.length === 0) {
    return (
      <div className="boxGlobal">
        <p className="text__display_tittle">Past Matches</p>
        <p
          className="info__text"
          style={{ padding: "20px", textAlign: "center" }}
        >
          No results recorded yet.
        </p>
      </div>
    );
  }

  const matchesToShow = matches.slice(0, visibleCount);
  return (
    <>
      <div className="global__section_style animate__item delay_2">
        <section>
          <p className="text__display_tittle section__tittle">Past Matches</p>
          <div className={style.tournament__card_container}>
            {matchesToShow.map((match) => (
              // Usamos boxGlobal aquí dentro para separar cada tarjeta
              <div
                key={match.id}
                className="boxGlobal"
                style={{ marginBottom: "20px" }}
              >
                <article className={style.next__match_header}>
                  <div>
                    <p className="info__text">{formatDate(match.matchDate)}</p>
                  </div>
                  <div>
                    <div className={style.match__state}>
                      <img src={matchEnd}></img>
                    </div>
                  </div>
                </article>

                <article className={style.next__match_content}>
                  {/* Equipo Local */}
                  <div className={style.team__card}>
                    <div className={style.team__img_name}>
                      <div className={style.team__img}>
                        <img
                          src={match.homeTeam?.imgProfile || teamImg}
                          alt={match.homeTeam?.name}
                          className={
                            !match.homeTeam?.imgProfile
                              ? style.icon__style
                              : style.full__img
                          }
                        />
                      </div>
                      <p className="text_name_small">{match.homeTeam?.name}</p>
                    </div>
                    <div className={style.match__result}>
                      {/* Mostramos el GOL real */}
                      <p className="name__text">
                        {match.homeScore ?? match.teamHomeScore ?? 0}
                      </p>
                    </div>
                  </div>
                  <p className="text_name_small">-</p>
                  {/* Equipo Visitante */}
                  <div className={style.team__card}>
                    <div className={style.match__result}>
                      {/* Mostramos el GOL real */}
                      <p className="name__text">
                        {match.awayScore ?? match.teamAwayScore ?? 0}
                      </p>
                    </div>
                    <div className={style.team__img_name}>
                      <div className={style.team__img}>
                        <img
                          src={match.awayTeam?.imgProfile || teamImg}
                          alt={match.awayTeam?.name}
                          className={
                            !match.awayTeam?.imgProfile
                              ? style.icon__style
                              : style.full__img
                          }
                        />
                      </div>
                      <p className="text_name_small">{match.awayTeam?.name}</p>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>
        {visibleCount < matches.length && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Button onClick={handleLoadMore} variant="primary">
              View More ({matches.length - visibleCount})
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default PastMatches;
