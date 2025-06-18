import TournamentCard from "./TournamentCard.jsx";
import { useNavigate } from "react-router-dom";
import {API} from "../../../Api.jsx";
import {useEffect, useState} from "react";
import axios from "axios";

function TournamentList() {
    const [tournaments, setTournaments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API}/tournaments`).then((res) => setTournaments(res.data));
    }, []);

    return (
        <div className="boxGlobal">
            {tournaments.map((tournament) => (
                <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    onManage={() => navigate(`/dashboard/tournament/${tournament.id}`)}
                />
            ))}
        </div>
    );
}

export default TournamentList;