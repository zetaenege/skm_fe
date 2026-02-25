import axios from "axios";
import { API } from "../../../Api.jsx";
import { useEffect, useState } from "react";
import styles from "./Search.module.css";
import TeamItem from "./TeamItem.jsx";
import InlineEditForm from "../management/editMenu/EditMenuInline.jsx";
import tournamentCup from "../../../assets/image/Icons/tournament.svg";
import isOpenIcon from "../../../assets/icons/open.svg";
import isClosedIcon from "../../../assets/icons/close.svg";
import editIcon from "../../../assets/icons/edit.svg";
import deleteIcon from "../../../assets/icons/delete.svg";
import style from "../statsvieuw/StatsVieuw.module.css";

function TournamentItem({ tournament, searchTerm = "" }) {
  // --- ESTADOS LOCALES ---
  const [localTournament, setLocalTournament] = useState(tournament);
  const [isEditing, setIsEditing] = useState(false);

  // NUEVO: Estado para controlar el cuadro de confirmación de borrado
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

  // --- NUEVA FUNCIÓN: CONFIRMAR Y BORRAR EL TORNEO ---
  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/tournaments/${localTournament.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Torneo eliminado con éxito");
      setIsDeleting(false);
      window.location.reload(); // Refresca la página para actualizar la lista
    } catch (err) {
      console.error("Error al eliminar el torneo:", err);
    }
  };

  return (
    <div className={styles.accordion__item}>
      {/* --- CABECERA DEL TORNEO --- */}
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

        {/* --- BOTONES DE EDITAR Y BORRAR --- */}
        <div className={styles.control__edit}>
          <div className={styles.edit__delete_container}>
            {/* BOTÓN EDITAR */}
            <span
              className={styles.arrow}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
                setIsDeleting(false); // Cierra el de borrar si estaba abierto
              }}
            >
              <img
                src={editIcon}
                alt="Edit"
                className={styles.icons__search_bar}
              />
            </span>

            {/* BOTÓN BORRAR */}
            <span
              className={styles.arrow}
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(!isDeleting); // Abre el cuadro de confirmación
                setIsEditing(false); // Cierra el de editar si estaba abierto
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

      {/* 2. NUEVO: CUADRO DE CONFIRMACIÓN DE BORRADO */}
      {isDeleting && (
        <div
          style={{
            padding: "12px 15px",
            backgroundColor: "rgba(233, 69, 96, 0.1)",
            border: "1px solid #e94560",
            borderRadius: "8px",
            margin: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <p
            style={{
              color: "#e94560",
              margin: 0,
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Are you sure you want to delete this tournament? This cannot be
            undone.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleConfirmDelete}
              style={{
                background: "#e94560",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setIsDeleting(false)}
              style={{
                background: "#444",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* --- LISTA DE EQUIPOS ADENTRO DEL ACORDEÓN --- */}
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
