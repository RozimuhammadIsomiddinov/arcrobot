"use strict";
import { DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";

const Worker = sequelize.define(
  "worker",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    worker_type: DataTypes.STRING,
    description: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "worker",
    tableName: "worker",

    timestamps: true,
  }
);

export default Worker;
