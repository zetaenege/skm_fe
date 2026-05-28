import styles from "./Dashboard.module.css";
import ProfileArea from "../../components/dashElements/profileArea/ProfileArea.jsx";
import TournamentProfileInfo from "../../components/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";
import NextMatch from "../../components/statsvieuw/NextMatch.jsx";
import NewTeam from "../management/NewTeam.jsx";
import JoinTeam from "../management/JoinTeam.jsx";
import PositionTable from "../../components/statsvieuw/PositionTable.jsx";
import TeamSquad from "../../components/statsvieuw/TeamSquad.jsx";
import UpcomingMatches from "../../components/statsvieuw/UpcomingMatches.jsx";
import PastMatches from "../../components/statsvieuw/PastMatches.jsx";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../assets/context/AuthContext.jsx";
import { API } from "../../Api.jsx";
import Champion from "../../components/formSteps/confirmations/Champion/ChampionTeam.jsx";
import DownloadReport from "../../helpers/DownloadReport.jsx";

function DashboardUser() {
  const { user } = useContext(AuthContext);
  const [tournament, setTournament] = useState(null);
  const [isTournamentFinished, setIsTournamentFinished] = useState(false);
  const [champion, setChampion] = useState(null);
  const [matches, setMatches] = useState([]);
  const myTournamentId = user?.tournamentId || 1;
  const myTeamId = user?.teamId || user?.team?.id;

  useEffect(() => {
    const searchId = user?.tournamentId || 1;

    const fetchMyTournament = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [resTour, resMatches] = await Promise.all([
          API.get(`/tournaments/${searchId}`, config),
          API.get(`/matches/tournament/${searchId}`, config),
        ]);

        const tourData = resTour.data;
        const matchesData = resMatches.data;

        setTournament(tourData);
        setMatches(matchesData);

        const hasMatches = matchesData.length > 0;
        const allFinished =
          hasMatches && matchesData.every((m) => m.status === "FINISHED");

        setIsTournamentFinished(allFinished);

        if (allFinished && tourData.teams?.length > 0) {
          const sortedTeams = [...tourData.teams].sort(
            (a, b) =>
              (b.points || 0) - (a.points || 0) ||
              (b.goalDifference || 0) - (a.goalDifference || 0),
          );
          setChampion(sortedTeams[0]);
        }
      } catch (err) {
        console.error("Error loading user tournament:", err);
      }
    };

    if (user) {
      fetchMyTournament();
    }
  }, [user, myTournamentId]);

  return (
    <div>
      <div className="boxGlobal animate__page_enter block_first">
        <section className={styles.info_area}>
          <article className={`animate__item delay_1 ${styles.half__article}`}>
            <ProfileArea mode="user" />
          </article>

          <article
            className={` animate__item delay_2 ${styles.half__article} ${styles.half__vertical}`}
          >
            <TournamentProfileInfo
              type="user"
              tournamentId={user?.tournamentId || 1}
            />

            {isTournamentFinished && champion ? (
              <div className="champion__report">
                <Champion team={champion} tournament={tournament} />
                <DownloadReport
                  tournament={tournament}
                  champion={champion}
                  userTeamId={myTeamId}
                  matches={matches}
                  className="download__report"
                />
              </div>
            ) : (
              <NextMatch
                tournamentId={myTournamentId}
                teamId={myTeamId}
                tournamentName={tournament?.name}
              />
            )}
          </article>
        </section>
      </div>

      {!user?.isCoach && !user?.teamId && (
        <div className={styles.new__create}>
          <JoinTeam />
          <NewTeam />
        </div>
      )}

      <div className={styles.table__team_squad}>
        <TeamSquad teamId={myTeamId} />
        <PositionTable teams={tournament?.teams || []} />
      </div>

      <UpcomingMatches tournamentId={myTournamentId} teamId={myTeamId} />
      <PastMatches tournamentId={myTournamentId} teamId={myTeamId} />
    </div>
  );
}

export default DashboardUser;
