import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API } from "../../Api.jsx"; // Ajusta si tu ruta es diferente

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuth: false,
    user: null,
    status: "pending",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        void fetchUserData(token);
      } catch (err) {
        console.error("Token inválido:", err);
        logout();
      }
    } else {
      setAuthState({ isAuth: false, user: null, status: "done" });
    }
  }, []);

  function login(JWT) {
    localStorage.setItem("token", JWT);
    void fetchUserData(JWT, true);
  }

  function logout() {
    localStorage.removeItem("token");
    setAuthState({ isAuth: false, user: null, status: "done" });
    navigate("/");
  }

  //FetchData
  async function fetchUserData(token, redirect = false) {
    try {
      const response = await axios.get(`${API}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        imgProfile: response.data.imgProfile,
        isAdmin: response.data.isAdmin || response.data.admin,
        isCoach: response.data.isCoach || response.data.coach,
        position: response.data.position,
        teamId: response.data.teamId,
        tournamentId: response.data.tournamentId,
        roles: response.data.admin ? ["ADMIN"] : ["USER"],
      };

      setAuthState({
        isAuth: true,
        user,
        status: "done",
      });

      if (redirect) {
        if (user.isAdmin) {
          navigate("/dashboard");
        } else {
          navigate("/dashboarduser");
        }
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      logout();
    }
  }

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await fetchUserData(token);
    }
  };

  const contextData = {
    ...authState,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {authState.status === "done" ? children : <p>Loading...</p>}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
