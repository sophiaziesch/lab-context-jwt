const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/isAuthenticated");

router.get("/", (req, res, next) => {
	res.json("All good in auth");
});

/* POST route to signup */
router.post("/signup", async (req, res, next) => {
	/* Get back the payload from your request, as it's a POST you can access req.body */
	const payload = req.body;

	/* Hash the password using bcryptjs */
	const salt = bcrypt.genSaltSync(13);
	const passwordHash = bcrypt.hashSync(payload.password, salt);

	/* Record your user to the DB */
	try {
		await User.create({ username: payload.username, password: passwordHash });
		res.status(201).json({ message: "User created" });
	} catch (error) {
		console.log("Error on POST signup: "(error));
		res.status(500).json.error;
	}
});

/* POST route to login */
router.post("/login", async (req, res, next) => {
	/* Get back the payload from your request, as it's a POST you can access req.body */
	const payload = req.body;
	console.log(payload);
	try {
		/* Try to get your user from the DB */
		const potentialUser = await User.findOne({ username: payload.username });
		console.log(potentialUser);

		/* If your user exists, check if the password is correct */
		if (potentialUser) {
			if (bcrypt.compareSync(payload.password, potentialUser.password)) {
				/* If your password is correct, sign the JWT using jsonwebtoken */
				const authToken = jwt.sign(
					{ userId: potentialUser._id },
					process.env.TOKEN_SECRET,
					{ algorithm: "HS256", expiresIn: "6h" }
				);
				/* Sending back the token to the front */
				res.status(202).json({ token: authToken });
			} else {
				/* Incorrect password */
				res.status(403).json({ errorMessage: "Password invalid" });
			}
		} else {
			/* No user found */
			res.status(403).json({ errorMessage: "No user found" });
		}
	} catch (error) {
		console.log("Error on POST login: ", error);
		res.status(500).json.error;
	}
});

/* GET route to verify token */
router.get("/verify", isAuthenticated, async (req, res, next) => {
	// You need to use the middleware there, if the request passes the middleware, it means your token is good
	const currentUser = await User.findById(req.payload.userId);
	currentUser.password = "*****";
	res.status(200).json({ message: "Token is valid", currentUser });
});

module.exports = router;
