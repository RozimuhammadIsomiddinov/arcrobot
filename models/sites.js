"use strict";
import { DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";

const Sites = sequelize.define(
  "sites",
  {
    name: DataTypes.STRING,
    link: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "sites",
    timestamps: true,
  }
);

export default Sites;
