import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import sequelize from "../connection_config/DB.connect.js";
import Gadget from "./Gadget.model.js";
import User from "./User.model.js";

dotenv.config();

// Initialize models
const db = {
  sequelize,
  Sequelize,
  User,
  Gadget,
};


export default db;
