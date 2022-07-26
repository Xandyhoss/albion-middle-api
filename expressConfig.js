const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
app.use(cors());

module.exports = { app, port };
