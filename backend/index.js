const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");

connectToMongo();
const app = express();
const port = 4000;

app.use(cors());

//Mildware to join the database and route and to receive the classes
app.use(express.json());

// Available routes
app.use("/api/auth", require("./routes/auth")); // First is link on which it works and second is importing module
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`);
});
