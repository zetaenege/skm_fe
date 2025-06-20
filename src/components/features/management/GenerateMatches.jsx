import styles from "./management.module.css";
import Button from "../../common/button/Button.jsx";
import { useEffect, useState, useContext } from "react";
import { API } from "../../../Api.jsx";
import axios from "axios";
import { AuthContext } from "../../../assets/context/AuthContext.jsx";
import defaultTournamentImg from "../../../assets/icons/organisatoricon.svg";

function NewMember() {
    const { user } = useContext(AuthContext);
    const [tournament, setTournament] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function fetchTournament() {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const response = await axios.get(`${API}/tournaments`, { headers });

                if (response.data.length > 0) {
                    setTournament(response.data[0]); // Usa el primero o cambia según necesidad
                }
            } catch (error) {
                console.error("❌ Error al obtener torneo:", error);
                setMessage("Error loading tournament");
            }
        }

        fetchTournament();
    }, []);

    const handleGenerateMatches = async () => {
        if (!tournament) return;

        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.post(
                `${API}/tournaments/${tournament.id}/generate-matches`,
                {},
                { headers }
            );

            console.log("✅ Respuesta del backend (partidos generados):", response.data);

            setMessage("✅ Matches generated successfully!");
        } catch (error) {
            console.error("❌ Error al generar partidos:", error);
            setMessage("❌ Could not generate matches.");
        }
    };

    if (!tournament) return <p className="info__text">Loading tournament...</p>;

    return (
        <div className="boxGlobal">
            <p className="text__display_tittle">Generate matches</p>
            <p className={styles.content__text}>Click here to generate your matches</p>

            <div className={styles.request__wrapper}>
                <div className={styles.profile__wrapper}>
                    <div className={styles.img__profile}>
                        <img
                            src={tournament.imgProfile || defaultTournamentImg}
                            alt={`Tournament ${tournament.name}`}
                        />
                    </div>
                    <p className="content__text">
                        {tournament.name} has {tournament.teams?.length || 0} teams
                    </p>
                </div>

                <div className={styles.button__wrapper}>
                    <Button
                        type="button"
                        onClick={handleGenerateMatches}
                        children="Accept"
                        variant="requestaccept"
                    />
                </div>
            </div>

            {message && <p className={styles.content__text}>{message}</p>}
        </div>
    );
}

export default NewMember;