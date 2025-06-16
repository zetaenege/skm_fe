import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

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
                void fetchUserData(decoded.sub, token);
            } catch (e) {
                console.error("Invalid token:", e);
                logout(); // si el token no se puede decodificar
            }
        } else {
            setAuthState({
                isAuth: false,
                user: null,
                status: "done",
            });
        }
    }, []);

    function login(JWT, redirectURL = "/profile") {
        localStorage.setItem("token", JWT);
        const decoded = jwtDecode(JWT);
        void fetchUserData(decoded.sub, JWT, redirectURL);
    }

    function logout() {
        localStorage.removeItem("token");
        setAuthState({
            isAuth: false,
            user: null,
            status: "done",
        });
        console.log("User has been logged out!");
        navigate("/");
    }

    async function fetchUserData(id, token, redirectURL = "/profile") {
        try {
            const result = await axios.get(`http://localhost:3000/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const user = {
                username: result.data.username,
                email: result.data.email,
                id: result.data.id,
                isAdmin: result.data.isAdmin,
                isCoach: result.data.isCoach,
            };

            setAuthState({
                isAuth: true,
                user,
                status: "done",
            });

            if (user.isAdmin) {
                navigate("/dashboard");
            } else if (user.isCoach) {
                navigate("/dashboarduser");
            } else {
                navigate("/profile");
            }
        } catch (e) {
            console.error("Error fetching user data:", e);
            logout();
        }
    }

    const contextData = {
        ...authState,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {authState.status === "done" ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;