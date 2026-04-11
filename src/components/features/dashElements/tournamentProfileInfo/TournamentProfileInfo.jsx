import styles from "./TournamentProfileInfo.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../assets/context/AuthContext.jsx";
import { API } from "../../../../Api.jsx";
import axios from "axios";
import teamImg from "../../../../assets/image/Icons/team.svg";
import style from "../../statsvieuw/StatsVieuw.module.css";

function TournamentProfileInfo({
  type = "global",
  variant = "dark",
  tournamentId = null,
  tournamentData = null, // <-- CAMBIO 1: Recibe la data
}) {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const variantSt = variant === "light" ? styles.light : styles.dark;

  useEffect(() => {
    if (!user && type !== "tournament") {
      setLoading(false);
      return;
    }

    async function fetchData() {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      setLoading(true);

      if (type === "user" && tournamentData) {
        setData({
          val1: tournamentData.name || "TBA",
          title1: "League",
          val2: tournamentData.startDate
            ? new Date(tournamentData.startDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })
            : "-",
          title2: "Start",
          val3: tournamentData.endDate
            ? new Date(tournamentData.endDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })
            : "-",
          title3: "End",
          val4: tournamentData.city || "-",
          title4: "City",
        });
        setLoading(false);
        return;
      }

      try {
        const tId = tournamentId || user?.tournamentId;
        if (type === "tournament" && tId) {
          const [resTour, resMatches] = await Promise.all([
            axios.get(`${API}/tournaments/${tId}`, config),
            axios.get(`${API}/matches/tournament/${tId}`, config),
          ]);

          const tour = resTour.data;
          const matches = resMatches.data;

          const totalGoals = matches.reduce((acc, m) => {
            if (m.status === "FINISHED") {
              return (
                acc +
                (m.homeScore || m.teamHomeScore || 0) +
                (m.awayScore || m.teamAwayScore || 0)
              );
            }
            return acc;
          }, 0);

          const finishedGames = matches.filter(
            (m) => m.status === "FINISHED",
          ).length;

          const calculatedTotalPlayers =
            tour.teams?.reduce((sum, team) => {
              const teamPlayersCount =
                team.squad?.length || team.users?.length || 0;
              return sum + teamPlayersCount;
            }, 0) || 0;

          setData({
            title1: "Teams",
            val1: tour.teams?.length || 0,
            title2: "Players",
            val2: calculatedTotalPlayers,
            title3: "Games",
            val3: `${finishedGames}/${matches.length}`,
            title4: "Goals",
            val4: totalGoals || 0,
          });
        } else if (type === "global" && user.isAdmin) {
          const [resTournaments, resTeams, resUsers, resMatches] =
            await Promise.all([
              axios.get(`${API}/tournaments`, config),
              axios.get(`${API}/teams`, config),
              axios.get(`${API}/users`, config),
              axios.get(`${API}/matches`, config),
            ]);

          const allMatches = resMatches.data;
          const totalSystemGoals = allMatches.reduce((acc, m) => {
            if (m.status === "FINISHED") {
              return (
                acc +
                (m.homeScore || m.teamHomeScore || 0) +
                (m.awayScore || m.teamAwayScore || 0)
              );
            }
            return acc;
          }, 0);

          setData({
            title1: "Tournaments",
            val1: resTournaments.data.length,
            title2: "Teams",
            val2: resTeams.data.length,
            title3: "Players",
            val3: resUsers.data.length,
            title4: "Total Goals",
            val4: totalSystemGoals,
          });
        } else if (user?.teamId) {
          const searchTourId = tournamentId || user.tournamentId || 1;
          const resTour = await axios.get(
            `${API}/tournaments/${searchTourId}`,
            config,
          );
          const allTeams = resTour.data.teams || [];

          allTeams.sort(
            (a, b) =>
              (b.points || 0) - (a.points || 0) ||
              (b.goalDifference || 0) - (a.goalDifference || 0),
          );

          const myRankIndex = allTeams.findIndex(
            (t) => String(t.id) === String(user.teamId),
          );
          const myTeamData = myRankIndex !== -1 ? allTeams[myRankIndex] : {};
          const positionDisplay =
            myRankIndex !== -1 ? `${myRankIndex + 1}º` : "-";

          setData({
            val1: myTeamData.imgProfile || teamImg,
            title1: "Logo",
            val2: positionDisplay,
            title2: "Position",
            val3: myTeamData.goalsFor || 0,
            title3: "Goals",
            val4: myTeamData.matchesPlayed || 0,
            title4: "Games",
          });
        } else {
          setData(null);
        }
      } catch (e) {
        console.error("Error fetching tournament info data:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, type, tournamentId, tournamentData]); // <-- CAMBIO 3: Añadido aquí

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!data) return null;

  return (
    <div className={style.tournament__info}>
      <h4 className="info__tittle_profile">Tournament Info</h4>
      <div className={styles.info__tournament_section}>
        <article className={`${styles.info_article} ${variantSt}`}>
          {data.title1 === "Logo" ? (
            <div className={styles.img__team}>
              <img
                src={data.val1}
                alt="Team Logo"
                className={
                  data.val1 === teamImg ? style.icon__style : style.full__img
                }
              />
            </div>
          ) : (
            <>
              <p className="name__text">{data.val1}</p>
              <p className="info__text_mini">{data.title1}</p>
            </>
          )}
        </article>

        <article className={`${styles.info_article} ${variantSt}`}>
          <p className="name__text">{data.val2}</p>
          <p className="info__text_mini">{data.title2}</p>
        </article>
        <article className={`${styles.info_article} ${variantSt}`}>
          <p className="name__text">{data.val3}</p>
          <p className="info__text_mini">{data.title3}</p>
        </article>
        <article className={`${styles.info_article} ${variantSt}`}>
          <p className="name__text">{data.val4}</p>
          <p className="info__text_mini">{data.title4}</p>
        </article>
      </div>
    </div>
  );
}

export default TournamentProfileInfo;
