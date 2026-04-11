import styles from "./ProfileArea.module.css";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../assets/context/AuthContext.jsx";
import axios from "axios";
import { API } from "../../../../Api.jsx";
import tournamentCup from "../../../../assets/icons/img_tournament.svg";
import userProfile from "../../../../assets/image/Profile/user_Profile.svg";
import style from "../../statsvieuw/StatsVieuw.module.css";
import coachIcon from "../../../../assets/icons/coach.svg";

function ProfileArea({ mode = "user", tournamentId = null }) {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [tournamentData, setTournamentData] = useState(null);
  const isAdmin = user?.isAdmin === true;
  const isTournament = mode === "tournament" && tournamentData;
  const hasPhoto = isTournament ? tournamentData?.imgProfile : user?.imgProfile;
  const displayImage = isTournament
    ? tournamentData?.imgProfile || tournamentCup
    : user?.imgProfile || userProfile;
  const isIcon = isTournament ? !tournamentData?.imgProfile : !user?.imgProfile;
  const imgClassName = isIcon ? styles.placeholder_icon : styles.real_image;

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const resTeams = await axios.get(`${API}/teams`, config);
        setTeams(resTeams.data);

        const tId = tournamentId || user?.tournamentId;
        if (mode === "tournament" && tId) {
          const resTour = await axios.get(`${API}/tournaments/${tId}`, config);
          setTournamentData(resTour.data);
        }
      } catch (err) {
        console.error("Error loading ProfileArea data:", err);
      }
    }

    loadData();
    window.addEventListener("torneoActualizado", loadData);
    return () => {
      window.removeEventListener("torneoActualizado", loadData);
    };
  }, [user, tournamentId, mode]);

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className={styles.profile_wrapper}>
      <div className={styles.img__profile}>
        <img
          src={displayImage}
          alt="Profile/Tournament"
          className={imgClassName}
        />
      </div>

      <div className={styles.profile__info}>
        {isTournament ? (
          <>
            <p className="name__text">{tournamentData.name}</p>
            <p className="info__text">
              <span className={style.day__strong}>Start:</span>{" "}
              {tournamentData.startDate
                ? new Date(tournamentData.startDate).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                    },
                  )
                : "TBD"}{" "}
              | <span className={style.day__strong}>End:</span>{" "}
              {tournamentData.endDate
                ? new Date(tournamentData.endDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })
                : "TBD"}
            </p>
            <p className="info__text">{tournamentData.city || "Leeuwarden"}</p>
          </>
        ) : (
          <>
            <p className="name__text">{user.name || "User"}</p>
            {isAdmin ? (
              <p className="info__text">Admin access</p>
            ) : (
              <>
                <p className="info__text">
                  {teams?.find((t) => t.id === user?.teamId)?.name || "No Team"}
                </p>
                {user?.isCoach ? (
                  <p
                    className="mono"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <img
                      src={coachIcon}
                      alt="Coach"
                      style={{ width: "16px", height: "16px" }}
                    />
                    Coach
                  </p>
                ) : (
                  <p className="mono">{user.position || "Player"}</p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileArea;
