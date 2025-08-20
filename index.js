import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import consultRoute from "./routes/consult.route.js";
import blogRoute from "./routes/blog.route.js";
import catalogRoute from "./routes/catalog.route.js";
import sitesRoute from "./routes/site.route.js";
import imagePositionRoute from "./routes/image_position.route.js";
import { adminJs, adminRouter } from "./admin.config.js";
import bodyParser from "body-parser";

import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicFolderPath = path.join(__dirname, "public");
const imagesFolderPath = path.join(publicFolderPath, "images");

if (!fs.existsSync(publicFolderPath)) {
  fs.mkdirSync(publicFolderPath);
  console.log("Public folder created successfully.");
}
if (!fs.existsSync(imagesFolderPath)) {
  fs.mkdirSync(imagesFolderPath);
  console.log("Images folder created successfully.");
}

const app = express();

app.use(adminJs.options.rootPath, adminRouter);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "https://www.arcrobot.ru",
      "https://arcrobot.vercel.app",
      "https://arcrobot.ru",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Cars API",
      version: "1.0.0",
      description: "Car management API documentation",
    },
    servers: [
      {
        url: "https://arcrobot.ru",
      },
      {
        url: "http://62.113.109.158:7007",
      },
      {
        url: "http://localhost:7007",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/consult", consultRoute);
app.use("/api/blog", blogRoute);
app.use("/api/catalog", catalogRoute);
app.use("/api/sites", sitesRoute);
app.use("/api/image-position", imagePositionRoute);

app.listen(process.env.PORT, () => {
  console.log("listened");
});
