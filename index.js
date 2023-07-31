const express = require("express");
const router = require("./routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

app.listen(3005, () => {
  console.log("Server running on port 3005");
});
