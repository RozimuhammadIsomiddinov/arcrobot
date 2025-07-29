"use strict";
import { DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";

const Blogs = sequelize.define(
  "blog",
  {
    title: DataTypes.STRING,
    subtitles: DataTypes.JSON,
    images: DataTypes.ARRAY(DataTypes.STRING),
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
    modelName: "blog",
    timestamps: true,
  }
);

export default Blogs;
