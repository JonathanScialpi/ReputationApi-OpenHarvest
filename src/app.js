require('dotenv').config();
const express = require("express");
// import eventRoute from "./routes/event-route";
const port = process.env.PORT;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api", eventRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});