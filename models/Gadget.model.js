import { DataTypes } from "sequelize";
import sequelize from "../connection_config/DB.connect.js";

const Gadget = sequelize.define("Gadget", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      "Available",
      "Deployed",
      "Destroyed",
      "Decommissioned"
    ),
    defaultValue: "Available",
  },
  decommissioned_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default Gadget;
