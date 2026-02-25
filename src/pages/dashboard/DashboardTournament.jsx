import styles from "./dashboard.module.css";
import ProfileArea from "../../components/features/dashElements/profileArea/ProfileArea.jsx";
import TournamentProfileInfo from "../../components/features/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";
import GenerateMatches from "../../components/features/management/GenarateMatches.jsx";
import PositionTable from "../../components/features/statsvieuw/PositionTable.jsx";
import UpcomingMatches from "../../components/features/statsvieuw/UpcomingMatches.jsx";
import PastMatches from "../../components/features/statsvieuw/PastMatches.jsx";
import NextMatchLive from "../../components/features/statsvieuw/NextMatchLive.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../../Api.jsx";
import axios from "axios";
import EditMenu from "../../components/features/management/editMenu/EditMenu.jsx";

function DashboardTournament() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);

  // 1. NUEVO: Creamos un gatillo numérico
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const fetchTournamentData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/tournaments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Datos del torneo cargados:", res.data);
      setTournament(res.data);

      // 2. NUEVO: Cada vez que pedimos datos nuevos, sumamos 1 al gatillo
      setUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Error cargando el torneo:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTournamentData();
    }
  }, [id]);

  return (
    <div>
      <div className="boxGlobal">
        <div className={styles.header__actions}>
          <EditMenu
            type="tournament"
            data={tournament}
            onUpdateSuccess={fetchTournamentData}
          />
        </div>

        <div className={styles.info_area}>
          <article className={styles.half__article}>
            {/* 3. NUEVO: Le pasamos el gatillo como 'key'. Si el número cambia, se redibuja fresco */}
            <ProfileArea
              key={`profile-${updateTrigger}`}
              mode="tournament"
              tournamentId={id}
            />
          </article>
          <article
            className={`${styles.half__article} ${styles.half__vertical}`}
          >
            {/* 3. NUEVO: Hacemos lo mismo aquí */}
            <TournamentProfileInfo
              key={`info-${updateTrigger}`}
              type="tournament"
              tournamentId={id}
            />
          </article>
        </div>
      </div>

      <div className={styles.new__generate}>
        <GenerateMatches
          tournamentId={id}
          onMatchesGenerated={() => window.location.reload()}
        />
      </div>
      <NextMatchLive tournamentId={id} />
      <PositionTable teams={tournament?.teams || []} />
      <UpcomingMatches tournamentId={id} />
      <PastMatches tournamentId={id} />
    </div>
  );
}

export default DashboardTournament;
