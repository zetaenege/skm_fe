import axios from "axios";
import { API } from "../../Api.jsx";
import { useEffect, useState } from "react";
import styles from "./Search.module.css";
import TeamItem from "./TeamItem.jsx";
import InlineEditForm from "../management/floatMenu/EditMenuInline.jsx";
import tournamentCup from "../../assets/image/Icons/tournament.svg";
import isOpenIcon from "../../assets/icons/open.svg";
import isClosedIcon from "../../assets/icons/close.svg";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import style from "../../components/statsvieuw/StatsVieuw.module.css";
import Button from "../../components/common/button/Button.jsx";

function TournamentItem({ tournament, searchTerm = "" }) {
  const [localTournament, setLocalTournament] = useState(tournament);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (searchTerm && !isOpen && !hasLoaded) {
      handleToggle();
    }
  }, [searchTerm]);

  const handleToggle = async () => {
    if (!isOpen && !hasLoaded) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API}/tournaments/${localTournament.id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setTeams(res.data.teams || []);
        setHasLoaded(true);
      } catch (error) {
        console.error("Error loading teams:", error);
      } finally {
        setLoading(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/tournaments/${localTournament.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsDeleting(false);
      window.location.reload();
    } catch (err) {
      console.error("Error al eliminar el torneo:", err);
    }
  };

  return (
    <div className={styles.accordion__item}>
      <div className={styles.accordion__header} onClick={handleToggle}>
        <div className={styles.header__title}>
          <span className={styles.icon}>
            <div className={styles.img__profile}>
              <img
                src={localTournament.imgProfile || tournamentCup}
                alt={localTournament.name || "Tournament image"}
                className={
                  !localTournament.imgProfile
                    ? style.icon__style
                    : style.full__img
                }
              />
            </div>
          </span>
          <p className={styles.name__text}>{localTournament.name}</p>
        </div>

        <div>
          <p className="info__text">
            <strong>Start:</strong>{" "}
            {localTournament.startDate
              ? new Date(localTournament.startDate).toLocaleDateString(
                  "en-GB",
                  { day: "2-digit", month: "short" },
                )
              : "TBD"}{" "}
            - <strong>End:</strong>{" "}
            {localTournament.endDate
              ? new Date(localTournament.endDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })
              : "TBD"}
          </p>
        </div>

        <div className={styles.control__edit}>
          <div className={styles.edit__delete_container}>
            <span
              className={styles.arrow}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
                setIsDeleting(false);
              }}
            >
              <img
                src={editIcon}
                alt="Edit"
                className={styles.icons__search_bar}
              />
            </span>

            <span
              className={styles.arrow}
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(!isDeleting);
                setIsEditing(false);
              }}
            >
              <img
                src={deleteIcon}
                className={styles.icons__search_bar}
                alt="Delete"
              />
            </span>
          </div>

          {/* ICONO DE ABRIR/CERRAR ACORDEÓN */}
          <span className={styles.arrow}>
            {isOpen ? (
              <img
                src={isClosedIcon}
                className={styles.icons__search_bar}
                alt="Close"
              />
            ) : (
              <img
                src={isOpenIcon}
                className={styles.icons__search_bar}
                alt="Open"
              />
            )}
          </span>
        </div>
      </div>

      {/* --- ZONA DE FORMULARIOS DESPLEGABLES --- */}

      {/* 1. FORMULARIO DE EDICIÓN */}
      {isEditing && (
        <InlineEditForm
          type="tournament"
          item={localTournament}
          onClose={() => setIsEditing(false)}
          onSuccess={(updatedData) => setLocalTournament(updatedData)}
        />
      )}

      {isDeleting && (
        <div
          className={`${style.dropdown__form_inline} animate__dropdown_enter`}
        >
          <p className={style.form__text}>
            Are you sure you want to delete this tournament? This action cannot
            be undone.
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              variant="requestaccept"
            >
              Delete
            </Button>
            <Button
              type="button"
              onClick={() => setIsDeleting(false)}
              variant="requestdecline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className={styles.accordion__body}>
          {loading && <p className={styles.status_text}>Loading teams...</p>}
          {!loading && teams.length === 0 && (
            <p className={styles.status_text}>No teams found.</p>
          )}

          {teams.map((team) => (
            <TeamItem key={team.id} team={team} searchTerm={searchTerm} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TournamentItem;
