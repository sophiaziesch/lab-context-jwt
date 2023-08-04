import { Box, Button, PasswordInput, Text, TextInput } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005/api/auth/signup";

const SignupPage = () => {
	// Add some states to control your inputs
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		// Send your signup information to your backend
		try {
			const response = await axios.post(API_URL, { username, password });
			console.log("Signup response: ", response);
			navigate("/login");
		} catch (error) {
			console.log("Error on signup handleSubmit: ", error);
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
				Signup
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
					Register
				</Button>
			</Box>
		</Box>
	);
};

export default SignupPage;
