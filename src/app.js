import express from "express";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tasks", taskRoutes);

export default app;