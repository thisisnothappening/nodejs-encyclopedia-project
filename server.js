const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/database.js");
const errorHandler = require("./middleware/errorHandler.js");
const cookieParser = require('cookie-parser');

db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch(err => console.error("Error: " + err));

app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/articles", require("./routes/articles"));
app.use("/categories", require("./routes/categories"));
app.use("/users", require("./routes/users"));
app.use(require("./routes/auth"));

app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
