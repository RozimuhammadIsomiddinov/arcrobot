import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import consultRoute from "./routes/consult.js";
import { adminJs, adminRouter } from "./admin.config.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(adminJs.options.rootPath, adminRouter);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/consult", consultRoute);
app.use("/admin", adminRouter);

app.listen(process.env.PORT, () => {
  console.log("listened");
});
