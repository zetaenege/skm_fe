import styles from "./dashboard.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../../Api.jsx";
import ProfileArea from "../../components/dashElements/profileArea/ProfileArea.jsx";
import TournamentProfileInfo from "../../components/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";
import GenerateMatches from "../management/GenarateMatches.jsx";
import PositionTable from "../../components/statsvieuw/PositionTable.jsx";
import UpcomingMatches from "../../components/statsvieuw/UpcomingMatches.jsx";
import PastMatches from "../../components/statsvieuw/PastMatches.jsx";
import NextMatchLive from "../../components/statsvieuw/NextMatchLive.jsx";
import Champion from "../../components/formSteps/confirmations/Champion/ChampionTeam.jsx";

function DashboardTournament() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [isTournamentFinished, setIsTournamentFinished] = useState(false);
  const [champion, setChampion] = useState(null);

  const fetchTournamentData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [resTour, resMatches] = await Promise.all([
        axios.get(`${API}/tournaments/${id}`, config),
        axios.get(`${API}/matches/tournament/${id}`, config),
      ]);

      const tourData = resTour.data;
      const matchesData = resMatches.data;

      setTournament(tourData);

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

      setUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTournamentData();
    }
  }, [id]);

  return (
    <div>
      <div className="boxGlobal animate__page_enter block_first">
        <div className={`an ${styles.info_area}`}>
          <article className={`animate__item delay_1 ${styles.half__article}`}>
            <ProfileArea
              key={`profile-${updateTrigger}`}
              mode="tournament"
              tournamentId={id}
              onUpdate={fetchTournamentData}
            />
          </article>
          <article
            className={` animate__item delay_2 ${styles.half__article} ${styles.half__vertical}`}
          >
            <TournamentProfileInfo
              key={`info-${updateTrigger}`}
              type="tournament"
              tournamentId={id}
            />
            {isTournamentFinished && champion && (
              <Champion team={champion} tournament={tournament} />
            )}
          </article>
        </div>
      </div>

      {!isTournamentFinished && (
        <>
          <div className={styles.new__generate}>
            <GenerateMatches
              tournamentId={id}
              onMatchesGenerated={() => fetchTournamentData()}
            />
          </div>
          <NextMatchLive tournamentId={id} key={`nextLive-${updateTrigger}`} />
        </>
      )}

      <PositionTable teams={tournament?.teams || []} />
      <UpcomingMatches tournamentId={id} key={`upcoming-${updateTrigger}`} />
      <PastMatches tournamentId={id} key={`past-${updateTrigger}`} />
    </div>
  );
}

export default DashboardTournament;
