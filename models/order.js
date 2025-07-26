"use strict";
import { DataTypes } from "sequelize";
import sequelize from "../config/dbconfig.js";

const Order = sequelize.define(
  "orders",
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    reason: DataTypes.STRING,
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
    modelName: "Order",
    timestamps: true,
  }
);

export default Order;
