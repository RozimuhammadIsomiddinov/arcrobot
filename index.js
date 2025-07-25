import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import consultRoute from "./routes/consult.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/consult", consultRoute);

app.listen(process.env.PORT, () => {
  console.log("listened");
});
