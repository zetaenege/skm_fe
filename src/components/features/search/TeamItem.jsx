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
import InlineEditForm from "../management/floatMenu/EditMenuInline.jsx";
import DeleteConfirmMenu from "../management/floatMenu/DeletenInline.jsx";

function TeamItem({ team, searchTerm = "" }) {
  const [localTeam, setLocalTeam] = useState(team);
  const [localPlayers, setLocalPlayers] = useState(
    team.squad || team.users || [],
  );
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
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

  const handlePlayerUpdate = (updatedPlayer) => {
    setLocalPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)),
    );
  };

  const handleConfirmDeleteTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/teams/${localTeam.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Equipo eliminado con éxito");
      setIsDeletingTeam(false);
      window.location.reload();
    } catch (err) {
      console.error("Error al eliminar el equipo:", err);
    }
  };

  const handleConfirmDeletePlayer = async (playerId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/users/${playerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("✅ Jugador eliminado con éxito");
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
      {/* --- CABECERA DEL EQUIPO --- */}
      <div className={styles.team__header} onClick={() => setIsOpen(!isOpen)}>
        {/* ... (código del header: icono, nombre, ciudad) ... */}
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

        <div className={styles.control__edit}>
          <div className={styles.edit__delete_container}>
            <span
              className={styles.arrow}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingTeam(!isEditingTeam);
                setIsDeletingTeam(false);
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
                setIsDeletingTeam(!isDeletingTeam);
                setIsEditingTeam(false);
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

      {isEditingTeam && (
        <InlineEditForm
          type="team"
          item={localTeam}
          onClose={() => setIsEditingTeam(false)}
          onSuccess={(updatedData) => setLocalTeam(updatedData)}
        />
      )}

      {isDeletingTeam && (
        <DeleteConfirmMenu
          title="Delete Team"
          itemName={localTeam.name}
          onConfirm={handleConfirmDeleteTeam}
          onCancel={() => setIsDeletingTeam(false)}
        />
      )}

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

                  <div className={styles.control__edit}>
                    <div className={styles.edit__delete_container}>
                      <span
                        className={styles.arrow}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPlayerId(
                            editingPlayerId === player.id ? null : player.id,
                          );
                          setDeletingPlayerId(null);
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
                          setEditingPlayerId(null);
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

                {editingPlayerId === player.id && (
                  <InlineEditForm
                    type="user"
                    item={player}
                    onClose={() => setEditingPlayerId(null)}
                    onSuccess={handlePlayerUpdate}
                  />
                )}

                {deletingPlayerId === player.id && (
                  <DeleteConfirmMenu
                    title="Delete Player"
                    itemName={player.name}
                    onConfirm={() => handleConfirmDeletePlayer(player.id)}
                    onCancel={() => setDeletingPlayerId(null)}
                  />
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
