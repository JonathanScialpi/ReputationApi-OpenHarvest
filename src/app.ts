require('dotenv').config();
import express from "express";
const keyManagementRoute = require('./routes/key-management-route')
const port = process.env.PORT;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", keyManagementRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});