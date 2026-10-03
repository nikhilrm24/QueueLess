const express = require("express");
const userRoutes = require("./routes/userRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRoutes);

app.use(errorMiddleware);

module.exports = app;