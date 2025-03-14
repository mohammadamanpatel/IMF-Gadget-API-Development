import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
console.log("process.env.PGUSER", process.env.PGUSER);
console.log("process.env.PGPASSWORD", process.env.PGPASSWORD);
console.log("process.env.PGDATABASE", process.env.PGDATABASE);
console.log("process.env.PGHOST", process.env.PGHOST);
console.log("process.env.PGPORT", process.env.PGPORT);
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    port: process.env.PGPORT,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

export default sequelize;
