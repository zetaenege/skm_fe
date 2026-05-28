import styles from "./Search.module.css";
import Button from "../../components/common/button/Button.jsx";
import searchIcon from "../../assets/icons/search.svg";
import { useState } from "react";
import { API } from "../../Api.jsx";
import TournamentItem from "./TournamentItem.jsx";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tournaments, setTournaments] = useState([]); // Aquí guardaremos los resultados de la API
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Para saber si mostrar el mensaje de "No encontrado"

  const handleSearch = async (e) => {
    e.preventDefault();

    if (searchTerm.trim() === "") {
      setTournaments([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const token = localStorage.getItem("token");

    try {
      const res = await API.get(
        `/tournaments/search?query=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTournaments(res.data);
    } catch (error) {
      console.error("Error buscando en la base de datos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${styles.new__create_trn} boxGlobal animate__item delay_4`}
    >
      <p className="text__display_tittle">Search & Edit</p>
      <p className={styles.content__text}>
        Search for tournaments, teams, and players and edit their details or
        delete it.
      </p>
      <div className={styles.search__form_wrapper}>
        <form className={styles.input__group} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search tournament, team or player..."
            className={styles.search__input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            className={styles.search__button}
            type="submit"
            variant="search"
            disabled={loading}
          >
            <img
              src={searchIcon}
              alt="Search"
              className={styles.search__icon}
            />
          </Button>
        </form>
      </div>

      <div className={styles.results__container}>
        {/* Mensaje de carga */}
        {loading && <p className={styles.content__text}>Searching...</p>}

        {!loading &&
          tournaments.length > 0 &&
          tournaments.map((tournament) => (
            <TournamentItem
              key={tournament.id}
              tournament={tournament}
              searchTerm={searchTerm}
            />
          ))}

        {!loading && hasSearched && tournaments.length === 0 && (
          <p className={styles.content__text} style={{ color: "red" }}>
            No results found for "{searchTerm}".
          </p>
        )}
      </div>
    </div>
  );
}

export default Search;
