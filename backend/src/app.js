const express = require("express");
const userRoutes = require("./routes/userRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const businessRoutes=require("./routes/businessRoutes")
const app = express();

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/businesses", businessRoutes);

app.use(errorMiddleware);

module.exports = app;