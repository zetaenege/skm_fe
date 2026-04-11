import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../../Api.jsx";
import styles from "./TournamentProfileInfo.module.css";

function TournamentCardInfo({ variant = "light", tournamentId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const variantSt = variant === "light" ? styles.light : styles.dark;

  useEffect(() => {
    async function fetchData() {
      if (!tournamentId) return;

      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      setLoading(true);

      try {
        const [resTour, resMatches] = await Promise.all([
          axios.get(`${API}/tournaments/${tournamentId}`, config),
          axios.get(`${API}/matches/tournament/${tournamentId}`, config),
        ]);

        const tour = resTour.data;
        const matches = resMatches.data;

        const totalGoals = matches.reduce((acc, m) => {
          if (m.status === "FINISHED") {
            return acc + (m.homeScore || 0) + (m.awayScore || 0);
          }
          return acc;
        }, 0);

        const finishedGames = matches.filter(
          (m) => m.status === "FINISHED",
        ).length;

        const playersCount =
          tour.totalPlayers ||
          tour.teams?.reduce(
            (acc, team) => acc + (team.squad?.length || 0),
            0,
          ) ||
          0;

        setData({
          title1: "Teams",
          val1: tour.teams?.length || 0,
          title2: "Players",
          val2: playersCount,
          title3: "Games",
          val3: `${finishedGames}/${matches.length}`,
          title4: "Goals",
          val4: totalGoals,
        });
      } catch (e) {
        console.error("Error en TournamentCardInfo:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tournamentId]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!data) return null;

  return (
    <div className="tournament-info">
      <h4 className="info__tittle_profile">Tournament Info</h4>
      <div className={styles.info__tournament_section}>
        {/* Caja Teams */}
        <article className={`${styles.info_article} ${variantSt}`}>
          <p className="name__text">{data.val1}</p>
          <p className="info__text_mini">{data.title1}</p>
        </article>

        <article className={`${styles.info_article} ${variantSt}`}>
          <p className="name__text">{data.val2}</p>
          <p className="info__text_mini">{data.title2}</p>
        </article>

        <article className={`${styles.info_article} ${variantSt}`}>
          <p className="name__text">{data.val3}</p>
          <p className="info__text_mini">{data.title3}</p>
        </article>

        {/* Caja Goals */}
        <article className={`${styles.info_article} ${variantSt}`}>
          <p className="name__text">{data.val4}</p>
          <p className="info__text_mini">{data.title4}</p>
        </article>
      </div>
    </div>
  );
}

export default TournamentCardInfo;
