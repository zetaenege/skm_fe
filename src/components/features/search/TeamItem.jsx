import styles from "./Search.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../Api.jsx";
import profileImage from "../../../assets/image/Profile/user_Profile.svg";
import profileTeamImage from "../../../assets/image/Icons/team.svg";
import isClosedIcon from "../../../assets/icons/close.svg";
import isOpenIcon from "../../../assets/icons/open.svg";
import editIcon from "../../../assets/icons/edit.svg";
import deleteIcon from "../../../assets/icons/delete.svg";

// Importamos el formulario mágico
import InlineEditForm from "../management/floatMenu/EditMenuInline.jsx";

function TeamItem({ team, searchTerm = "" }) {
  // --- ESTADOS LOCALES ---
  const [localTeam, setLocalTeam] = useState(team);
  const [localPlayers, setLocalPlayers] = useState(
    team.squad || team.users || [],
  );

  // --- ESTADOS PARA EDITAR ---
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState(null);

  // --- NUEVOS ESTADOS PARA BORRAR ---
  const [isDeletingTeam, setIsDeletingTeam] = useState(false);
  const [deletingPlayerId, setDeletingPlayerId] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchTeam =
        localTeam.name && localTeam.name.toLowerCase().includes(term);
      const matchPlayer = localPlayers.some(
        (p) =>
          (p.username && p.username.toLowerCase().includes(term)) ||
          (p.name && p.name.toLowerCase().includes(term)),
      );

      if (matchTeam || matchPlayer) {
        setIsOpen(true);
      }
    }
  }, [searchTerm, localPlayers, localTeam.name]);

  // --- FUNCIÓN PARA ACTUALIZAR JUGADOR AL EDITAR ---
  const handlePlayerUpdate = (updatedPlayer) => {
    setLocalPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)),
    );
  };

  // --- NUEVA FUNCIÓN: BORRAR EQUIPO ---
  const handleConfirmDeleteTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/teams/${localTeam.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Equipo eliminado con éxito");
      setIsDeletingTeam(false);
      window.location.reload(); // Recarga para limpiar la lista
    } catch (err) {
      console.error("Error al eliminar el equipo:", err);
    }
  };

  // --- NUEVA FUNCIÓN: BORRAR JUGADOR ---
  const handleConfirmDeletePlayer = async (playerId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/users/${playerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Jugador eliminado con éxito");

      // Actualiza la lista al instante quitando al jugador borrado
      setLocalPlayers((prevPlayers) =>
        prevPlayers.filter((p) => p.id !== playerId),
      );
      setDeletingPlayerId(null);
    } catch (err) {
      console.error("Error al eliminar el jugador:", err);
    }
  };

  return (
    <div className={styles.team__item}>
      {/* ========================================= */}
      {/* CABECERA DEL EQUIPO             */}
      {/* ========================================= */}
      <div className={styles.team__header} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.header__title}>
          <span className={styles.icon}>
            <div className={styles.img__profile}>
              <img
                src={localTeam.imgProfile || profileTeamImage}
                alt={localTeam.name || "Team image"}
                className={
                  !localTeam.imgProfile ? styles.icon__style : styles.full__img
                }
              />
            </div>
          </span>
          <p className={styles.name__text}>{localTeam.name}</p>
        </div>

        <div>
          <p className="info__text">
            <strong>City:</strong> {localTeam.city}
          </p>
        </div>

        {/* --- BOTONES DE EDITAR Y BORRAR (EQUIPO) --- */}
        <div className={styles.control__edit}>
          <div className={styles.edit__delete_container}>
            <span
              className={styles.arrow}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTeam(!isEditingTeam);
                setIsDeletingTeam(false); // Cierra borrar si estaba abierto
              }}
            >
              <img
                src={editIcon}
                className={styles.icons__search_bar}
                alt="Edit"
              />
            </span>

            <span
              className={styles.arrow}
              onClick={(e) => {
                e.stopPropagation();
                setIsDeletingTeam(!isDeletingTeam); // Abre confirmación
                setIsEditingTeam(false); // Cierra editar si estaba abierto
              }}
            >
              <img
                src={deleteIcon}
                className={styles.icons__search_bar}
                alt="Delete"
              />
            </span>
          </div>
          <span className={styles.arrow}>
            {isOpen ? (
              <img
                src={isClosedIcon}
                className={styles.icons__search_bar}
                alt=""
              />
            ) : (
              <img
                src={isOpenIcon}
                className={styles.icons__search_bar}
                alt=""
              />
            )}
          </span>
        </div>
      </div>

      {/* --- FORMULARIO PARA EDITAR EL EQUIPO --- */}
      {isEditingTeam && (
        <InlineEditForm
          type="team"
          item={localTeam}
          onClose={() => setIsEditingTeam(false)}
          onSuccess={(updatedData) => setLocalTeam(updatedData)}
        />
      )}

      {/* --- NUEVO: CUADRO CONFIRMACIÓN BORRAR EQUIPO --- */}
      {isDeletingTeam && (
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
            Are you sure you want to delete this team? This cannot be undone.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleConfirmDeleteTeam}
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
              onClick={() => setIsDeletingTeam(false)}
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

      {/* ========================================= */}
      {/* LISTA DE JUGADORES              */}
      {/* ========================================= */}
      {isOpen && (
        <div className={styles.player__list}>
          {localPlayers.length === 0 ? (
            <p className={styles.status_text_small}>No players in this team.</p>
          ) : (
            localPlayers.map((player) => (
              <div
                key={player.id || player.username}
                style={{ display: "flex", flexDirection: "column" }}
              >
                {/* --- FILA DEL JUGADOR --- */}
                <div className={styles.player__row}>
                  <div className={styles.header__title}>
                    <span>
                      <div className={styles.img__profile}>
                        <img
                          src={player.imgProfile || profileImage}
                          alt={player.name || "Player image"}
                          className={
                            !player.imgProfile
                              ? styles.icon__style
                              : styles.full__img
                          }
                        />
                      </div>
                    </span>
                    <p className={styles.name__text}>{player.name}</p>
                  </div>

                  <p className="info__text">
                    <strong>Position:</strong> {player.position}
                  </p>

                  {/* --- BOTONES DE EDITAR Y BORRAR (JUGADOR) --- */}
                  <div className={styles.control__edit}>
                    <div className={styles.edit__delete_container}>
                      <span
                        className={styles.arrow}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPlayerId(
                            editingPlayerId === player.id ? null : player.id,
                          );
                          setDeletingPlayerId(null); // Cierra borrar
                        }}
                      >
                        <img
                          src={editIcon}
                          className={styles.icons__search_bar}
                          alt="Edit"
                        />
                      </span>

                      <span
                        className={styles.arrow}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingPlayerId(
                            deletingPlayerId === player.id ? null : player.id,
                          );
                          setEditingPlayerId(null); // Cierra editar
                        }}
                      >
                        <img
                          src={deleteIcon}
                          className={styles.icons__search_bar}
                          alt="Delete"
                        />
                      </span>
                    </div>
                  </div>
                </div>

                {/* --- FORMULARIO PARA EDITAR AL JUGADOR --- */}
                {editingPlayerId === player.id && (
                  <InlineEditForm
                    type="user"
                    item={player}
                    onClose={() => setEditingPlayerId(null)}
                    onSuccess={handlePlayerUpdate}
                  />
                )}

                {/* --- NUEVO: CUADRO CONFIRMACIÓN BORRAR JUGADOR --- */}
                {deletingPlayerId === player.id && (
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "rgba(233, 69, 96, 0.1)",
                      border: "1px solid #e94560",
                      borderRadius: "8px",
                      marginTop: "5px",
                      marginBottom: "10px",
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
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      Delete this player?
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleConfirmDeletePlayer(player.id)}
                        style={{
                          background: "#e94560",
                          color: "#fff",
                          border: "none",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeletingPlayerId(null)}
                        style={{
                          background: "#444",
                          color: "#fff",
                          border: "none",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "12px",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TeamItem;
