import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import consultRoute from "./routes/consult.route.js";
import blogRoute from "./routes/blog.route.js";
import catalogRoute from "./routes/catalog.route.js";
import sitesRoute from "./routes/site.route.js";
import { adminJs, adminRouter } from "./admin.config.js";

import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import upload from "./middleware/multer.js";
import Blog from "./models/blog.js";
import Catalog from "./models/catalog.js";
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(adminJs.options.rootPath, adminRouter);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
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
        url: "http://62.113.109.158:7007",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/consult", consultRoute);
app.use("/blog", blogRoute);
app.use("/catalog", catalogRoute);
app.use("/sites", sitesRoute);
app.use("/admin", adminRouter);

app.post("/upload-multi", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Hech qanday fayl yuklanmadi" });
    }

    const imagePaths = req.files.map(
      (file) => `${process.env.BACKEND_URL}/${file.filename}`
    );

    const newImages = await Blog.create({
      title: req.body.title,
      subtitles: req.body.subtitles,
      description: req.body.description,
      images: imagePaths,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: "Fayllar va ma'lumotlar saqlandi",
      data: newImages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Xatolik yuz berdi" });
  }
});
app.post(
  "/upload-multi-catalog",
  upload.array("files", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Hech qanday fayl yuklanmadi" });
      }

      const imagePaths = req.files.map(
        (file) => `${process.env.BACKEND_URL}/${file.filename}`
      );

      let { name, title, description, property, images } = req.body;

      // ⚡ JSON.parse ni xavfsiz qilish
      try {
        property = property ? JSON.parse(property) : {};
      } catch {
        property = {};
      }

      try {
        images = images ? JSON.parse(images) : [];
      } catch {
        images = [];
      }

      // Fayllarni ham qo‘shamiz
      const finalImages = [...images, ...imagePaths];

      const catalog = await Catalog.create({
        name,
        title,
        description,
        images: finalImages,
        property,
      });

      res.json({ success: true, data: catalog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Xatolik yuz berdi" });
    }
  }
);

app.put(
  "/upload-multi-catalog-edit",
  upload.array("files", 10),
  async (req, res) => {
    try {
      const { id, name, title, description, property, oldImages } = req.body;

      let images = [];
      try {
        images = JSON.parse(oldImages || "[]");
        if (!Array.isArray(images)) images = [];
      } catch {
        images = [];
      }

      // yangi rasmlar
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(
          (file) => `${process.env.BACKEND_URL}/${file.filename}`
        );
        images = [...images, ...newImages];
      }

      // yangilash
      const updated = await Catalog.update(
        { name, title, description, property, images },
        { where: { id }, returning: true }
      );

      return res.json({
        success: true,
        data: updated[1][0],
      });
    } catch (err) {
      console.error("Xatolik:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);
app.listen(process.env.PORT, () => {
  console.log("listened");
});
