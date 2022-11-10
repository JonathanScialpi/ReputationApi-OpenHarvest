/// @title A node server capable of creating Ethereum addresses, paying reputation tokens, and retrieving reptuation of the Heifer Colony DAO.
/// @author Jonathan.Scialpi@ibm.com

require('dotenv').config();
import express from "express";
const keyManagementRoute = require('./routes/key-management-route');
const reputationRoute = require('./routes/reputation-route');
const port = process.env.LISTEN_PORT;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ethereum-address", keyManagementRoute);
app.use("/reputation", reputationRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
});