import style from "./StatsVieuw.module.css";
import { useEffect, useState } from "react";
import teamImg from "../../../assets/image/Icons/team.svg";
import axios from "axios";
import { API } from "../../../Api.jsx";
import matchPlaying from "../../../assets/icons/matchPlaying.svg";

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

function NextMatch({ tournamentId, teamId, tournamentName }) {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const BRAND_COLORS = [
    "var(--color-aqua)",
    "var(--color-lemon)",
    "var(--color-rosa)",
    "var(--color-violet)",
  ];

  useEffect(() => {
    if (!tournamentId) return;

    const fetchNextMatch = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API}/matches/tournament/${tournamentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const myNextMatch = res.data.find((m) => {
          const isScheduled = m.status === "SCHEDULED";
          const isMyTeam = teamId
            ? String(m.homeTeam?.id) === String(teamId) ||
              String(m.awayTeam?.id) === String(teamId)
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
        <p
          className="info__text"
          style={{ padding: "20px", textAlign: "center" }}
        >
          No upcoming match scheduled.
        </p>
      </section>
    );
  }

  console.log("ESTADO FINAL DE DATA:", match);

  return (
    <section className={style.next__match}>
      <h4 className="info__tittle_profile">Next Match</h4>

      <article className={style.next__match_header}>
        <div>
          <p className="info__text">{formatDate(match.matchDate)}</p>
        </div>

        <div>
          <div className={style.match__state}>
            <img src={matchPlaying}></img>
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
            <p className="info__tittle_profile">{match.homeTeam?.name}</p>
          </div>
          <div className={style.match__result}>
            <p className="name__text">0</p>
          </div>
        </div>
        <p className="name__text">-</p>
        {/* Equipo Visitante */}
        <div className={style.team__card}>
          <div className={style.match__result}>
            <p className="name__text">0</p>
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
            <p className="info__tittle_profile">{match.awayTeam?.name}</p>
          </div>
        </div>
      </article>
      <article>
        <div className={`${style.name__tournament} mono`}>
          <p className="text_name_small">{tournamentName}</p>
        </div>
      </article>
    </section>
  );
}

export default NextMatch;
