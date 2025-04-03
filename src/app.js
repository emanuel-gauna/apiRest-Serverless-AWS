import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js"


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

export default app;