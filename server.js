import express from "express";
const app = express();
import { config } from "dotenv";
import db from "./models/index.js";
import authRoutes from "./routes/Auth.routes.js";
import gadgetRoutes from "./routes/Gadget.routes.js";
import cookieParser from "cookie-parser";
config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connected successfully!");

    await db.sequelize.sync({ force: false });
    console.log("Models synchronized successfully.");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
startServer();
app.use("/api/auth", authRoutes);
app.use("/api/gadget", gadgetRoutes);
