"use strict";
import { DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";
const ImagePosition = sequelize.define(
  "imagePosition",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    catalog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "catalog", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    top: DataTypes.STRING,
    left_pos: DataTypes.STRING,
    image: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "imagePosition",
    tableName: "imagePosition",
  }
);

export default ImagePosition;
