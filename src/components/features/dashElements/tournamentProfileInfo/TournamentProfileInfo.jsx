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

          setData({
            title1: "Teams",
            val1: tour.teams?.length || 0,
            title2: "Players",
            val2: tour.totalPlayers || 0,
            title3: "Games",
            val3: `${finishedGames}/${matches.length}`,
            title4: "Goals",
            val4: totalGoals || 0,
          });
        }
        // PRIORIDAD 2: ADMIN GLOBAL
        else if (type === "global" && user.isAdmin) {
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
              // Sumamos local + visitante (usando la lógica segura de nombres)
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
        }
        // PRIORIDAD 3: USUARIO COMÚN
        else if (user?.teamId) {
          // 1. Necesitamos el ID del torneo para comparar con los rivales
          const searchTourId = tournamentId || user.tournamentId || 1;

          // 2. Pedimos el torneo completo (que trae la lista de teams actualizada)
          const resTour = await axios.get(
            `${API}/tournaments/${searchTourId}`,
            config,
          );
          const allTeams = resTour.data.teams || [];

          // 3. ORDENAMOS LOS EQUIPOS (Misma lógica que PositionTable)
          allTeams.sort((a, b) => {
            if (b.points !== a.points) {
              return b.points - a.points; // Más puntos primero
            }
            return b.goalDifference - a.goalDifference; // Mejor diferencia de goles después
          });

          // 4. ENCONTRAMOS A MI EQUIPO EN LA LISTA ORDENADA
          // Usamos String() por seguridad al comparar IDs
          const myRankIndex = allTeams.findIndex(
            (t) => String(t.id) === String(user.teamId),
          );

          // Si lo encontramos, sacamos sus datos. Si no, objeto vacío.
          const myTeamData = myRankIndex !== -1 ? allTeams[myRankIndex] : {};

          // 5. CALCULAMOS LA POSICIÓN VISUAL (Índice + 1 + "º")
          // Si el índice es 0 (primero), mostramos "1º"
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
        console.error("Error fetching admin data:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, type, tournamentId]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!data) return null;

  return (
    <div className={style.tournament__info}>
      <h4 className="info__tittle_profile">Tournament Info</h4>
      <div className={styles.info__tournament_section}>
        {/* CAJA 1: Team (Imagen) */}
        <article className={`${styles.info_article} ${variantSt}`}>
          {data.title1 === "Logo" ? (
            /* CASO USER: Solo mostramos el círculo con la imagen */
            <div className={styles.img__team}>
              <img
                src={data.val1}
                alt="Team Logo"
                /* Si data.val1 es exactamente el SVG de teamImg, aplicamos el estilo de icono. 
                       Si no, aplicamos el estilo de foto completa. */
                className={
                  data.val1 === teamImg ? style.icon__style : style.full__img
                }
              />
            </div>
          ) : (
            /* CASO ADMIN/TOURNAMENT: Mostramos valor y título normal */
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
