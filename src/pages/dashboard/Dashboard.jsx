import styles from "./Dashboard.module.css";
import ProfileArea from "../../components/features/dashElements/profileArea/ProfileArea.jsx";
import NewTournament from "../../components/features/management/NewTournament.jsx";
import TournamentProfileInfo from "../../components/features/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";
import NewTeam from "../../components/features/management/NewTeam.jsx";
import Search from "../../components/features/search/Search.jsx";
import TournamentCard from "../../components/features/statsvieuw/TournamentCard.jsx";
import { useContext } from "react";
import { AuthContext } from "../../assets/context/AuthContext.jsx";

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div className="boxGlobal animate__page_enter block_first">
        <section className={styles.info_area}>
          <article className={`animate__item delay_1 ${styles.half__article}`}>
            <ProfileArea
              key={`admin-profile-${user?.name}-${user?.imgProfile}`}
            />
          </article>
          <article
            className={` animate__item delay_2 ${styles.half__article} ${styles.half__vertical}`}
          >
            <TournamentProfileInfo />
          </article>
        </section>
      </div>

      <div className={styles.new__create}>
        <NewTournament />
        <NewTeam />
      </div>
      <Search />
      <TournamentCard />
    </div>
  );
}

export default Dashboard;
