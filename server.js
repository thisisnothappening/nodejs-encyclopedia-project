const express = require("express");
const app = express();
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler.js");
const cookieParser = require('cookie-parser');
const path = require("path");
require("dotenv").config();
require("./config/database.js");

app.use(cookieParser());
app.use(express.json());
app.use(cors({
	origin: [
		"http://localhost:3000",
		process.env.CORS_ORIGIN
	],
	credentials: true
}));

app.use("/users", require("./routes/users"));
app.use(require("./routes/auth"));

app.use("/articles", require("./routes/articles"));
app.use("/categories", require("./routes/categories"));

app.use(errorHandler);

app.use(express.static(path.join(__dirname, "build")));

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
const host = "0.0.0.0";
app.listen(port, host, () => console.log(`Listening on port ${port}...`));
