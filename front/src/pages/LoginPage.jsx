import { Box, Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { useContext, useState } from "react";
import { SessionContext } from "../contexts/SessionContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005/api/auth/login";

const LoginPage = () => {
	// Add some states to control your inputs
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState(null);
	const { authenticateUser } = useContext(SessionContext);
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		// Send your login information to your backend
		try {
			const { data } = await axios.post(API_URL, { username, password });
			console.log("Login response: ", data);
			localStorage.setItem("authToken", data.token);
			await authenticateUser();
			navigate("/");
		} catch (error) {
			console.log("Error on login handleSubmit: ", error);
			setErrorMessage(error.response.data.errorMessage);
		}
	};

	return (
		<Box
			sx={{
				margin: "0 auto",
				maxWidth: "400px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				height: "calc(100vh - 100px)",
			}}
		>
			<Text align="center" size="xl" weight="bold">
				Login
			</Text>
			<Box
				component="form"
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "20px",
					marginTop: "2rem",
				}}
				onSubmit={handleSubmit}
			>
				<TextInput
					value={username}
					onChange={(event) => setUsername(event.target.value)}
					label="Username"
					variant="filled"
					withAsterisk
				/>
				<PasswordInput
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					label="Password"
					variant="filled"
					withAsterisk
				/>
				<Button
					type="submit"
					variant="filled"
					color="cyan"
					sx={{ marginTop: "1rem", alignSelf: "center" }}
				>
					Connect
				</Button>
			</Box>
		</Box>
	);
};

export default LoginPage;
