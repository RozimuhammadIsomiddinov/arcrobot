"use strict";
import { DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";

const Blog = sequelize.define(
  "blog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    subtitles: DataTypes.STRING,
    images: DataTypes.ARRAY(DataTypes.STRING),
    description: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "blog",
    tableName: "blog",

    timestamps: true,
  }
);

export default Blog;
