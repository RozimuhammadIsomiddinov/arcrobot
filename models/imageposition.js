"use strict";
import { DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";

const ImagePosition = sequelize.define(
  "imagePosition",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    top: DataTypes.STRING,
    left: DataTypes.STRING,
    image: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "imagePosition",
    tableName: "imagePosition",
  }
);

export default ImagePosition;
