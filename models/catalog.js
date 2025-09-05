"use strict";
import { DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";

const Catalog = sequelize.define(
  "catalog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    title: DataTypes.STRING,
    images: DataTypes.ARRAY(DataTypes.STRING),
    property: DataTypes.JSON,
    description: DataTypes.TEXT,
    other_images: DataTypes.ARRAY(DataTypes.STRING),
    isHome: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Catalog",
    tableName: "catalog",
    timestamps: true,
  }
);
export default Catalog;
