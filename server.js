const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/database.js");
const errorHandler = require("./middleware/errorHandler.js");

db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch(err => console.log("Error: " + err));

app.use(express.json());
app.use(cors());

app.use("/articles", require("./routes/articleRoute"));
app.use("/categories", require("./routes/categoryRoute"));

app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
