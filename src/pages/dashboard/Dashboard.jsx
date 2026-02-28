import styles from "./Dashboard.module.css";
import ProfileArea from "../../components/features/dashElements/profileArea/ProfileArea.jsx";
import NewTournament from "../../components/features/management/NewTournament.jsx";
import TournamentProfileInfo from "../../components/features/dashElements/tournamentProfileInfo/TournamentProfileInfo.jsx";
import NewTeam from "../../components/features/management/NewTeam.jsx";
import Search from "../../components/features/search/Search.jsx";
import TournamentCardInfo from "../../components/features/dashElements/tournamentProfileInfo/TournamentCardInfo.jsx";
import TournamentCard from "../../components/features/statsvieuw/TournamentCard.jsx";

// 1. Nuevas importaciones necesarias para el Admin y el Menú
import { useContext } from "react";
import { AuthContext } from "../../assets/context/AuthContext.jsx";
import EditMenu from "../../components/features/management/floatMenu/EditMenu.jsx";

function Dashboard() {
  // 2. Extraemos los datos del Admin desde tu Contexto Global
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div className="boxGlobal">
        {/* --- 3. REEMPLAZAMOS EL LOGOUT POR TU NUEVO MENÚ --- */}
        <div className={styles.header__actions}>
          <EditMenu
            type="admin" // Le pasamos "admin" (el EditMenu lo enviará a la ruta de usuarios)
            data={user} // Le pasamos la información actual del Admin
          />
        </div>
        {/* --------------------------------------------------- */}

        <section className={styles.info_area}>
          <article className={styles.half__article}>
            {/* 4. EL TRUCO DE LA KEY:
                Al usar el nombre y la imagen en la key, si alguno de los dos cambia
                después de hacer 'Save', React redibujará esta sección al instante. */}
            <ProfileArea
              key={`admin-profile-${user?.name}-${user?.imgProfile}`}
            />
          </article>

          <article
            className={`${styles.half__article} ${styles.half__vertical}`}
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
