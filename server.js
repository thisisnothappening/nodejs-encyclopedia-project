const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/database.js");
const errorHandler = require("./middleware/errorHandler.js");
const cookieParser = require('cookie-parser');
const path = require("path");
require("dotenv").config();

db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch(err => console.error("Error: " + err));

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

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
app.listen(port, () => console.log(`Listening on port ${port}...`));
