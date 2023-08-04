// Create and export your context
import axios from "axios";
import { createContext, useEffect, useState } from "react";
const SessionContext = createContext();

const API_URL = "http://localhost:5005/api/auth/verify";

// Create your provider component that will keep your state
const SessionContextWrapper = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const authenticateUser = async () => {
		const tokenInStorage = localStorage.getItem("authToken");

		if (tokenInStorage) {
			try {
				const { data } = await axios.get(API_URL, {
					headers: { Authorization: `Bearer ${tokenInStorage}` },
				});
				console.log("Verify response from context: ", data);
				setUser(data.currentUser);
				setIsLoading(false);
				setIsLoggedIn(true);
			} catch (error) {
				console.log("Error on authenticate user function: ", error);
				setUser(null);
				setIsLoading(false);
				setIsLoggedIn(false);
			}
		} else {
			setUser(null);
			setIsLoading(false);
			setIsLoggedIn(false);
		}
	};

	useEffect(() => {
		authenticateUser();
	}, []);

	return (
		<SessionContext.Provider
			value={{ authenticateUser, user, isLoading, isLoggedIn }}
		>
			{children}
		</SessionContext.Provider>
	);
};

export { SessionContext, SessionContextWrapper };
