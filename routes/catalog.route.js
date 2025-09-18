import express from "express";
import {
  getAllCatalogCont,
  getCatalogByIDCont,
  getHomeCatalogsCont,
  setCatalogHomeCont,
  unsetCatalogHomeCont,
} from "../controllers/catalog/catalog.js";
import upload from "../middleware/multer.js";
import Catalog from "../models/catalog.js";
import { Op } from "sequelize";

const router = express.Router();

router.get("/home", getHomeCatalogsCont); // isHome = true bo'lgan cataloglar

/**
 * @swagger
 * tags:
 *   name: Catalog
 *   description: Catalog management
 */

/**
 * @swagger
 * /api/catalog:
 *   get:
 *     summary: Get all catalogs with pagination
 *     tags: [Catalog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of catalogs per page
 *     responses:
 *       200:
 *         description: List of catalogs with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Catalog'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total_records:
 *                       type: integer
 *                       example: 25
 *                     current_page:
 *                       type: integer
 *                       example: 1
 *                     total_pages:
 *                       type: integer
 *                       example: 3
 *                     next_page:
 *                       type: integer
 *                       example: 2
 *                     prev_page:
 *                       type: integer
 *                       example: null
 */

/**
 * @swagger
 * /api/catalog/{id}:
 *   get:
 *     summary: Get catalog by ID
 *     tags: [Catalog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Catalog ID
 *     responses:
 *       200:
 *         description: Catalog object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catalog'
 *       404:
 *         description: Catalog not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Catalog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Electronics"
 *         title:
 *           type: string
 *           example: "Top gadgets 2025"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["phone.jpg", "laptop.jpg"]
 *         property:
 *           type: object
 *           example: { color: "black", size: "medium" }
 *         description:
 *           type: string
 *           example: "This catalog contains latest electronics."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-08-01T12:34:56Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-08-01T12:34:56Z
 */

router.get("/", getAllCatalogCont);
router.get("/:id", getCatalogByIDCont);

router.post(
  "/create",
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "other_files", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      // 1️⃣ Fayllarni tekshirish
      if (
        (!req.files?.files || req.files.files.length === 0) &&
        (!req.files?.other_files || req.files.other_files.length === 0)
      ) {
        return res.status(400).json({ error: "Hech qanday fayl yuklanmadi" });
      }

      // 2️⃣ Asosiy images va other_images yo‘llarini shakllantirish
      const imagePaths = req.files?.files
        ? req.files.files.map(
            (file) => `${process.env.BACKEND_URL}/${file.filename}`
          )
        : [];

      const otherImagePaths = req.files?.other_files
        ? req.files.other_files.map(
            (file) => `${process.env.BACKEND_URL}/${file.filename}`
          )
        : [];

      let { name, title, description, property, images, other_images } =
        req.body;

      // JSON parse helper
      const safeParse = (data, fallback) => {
        try {
          return data ? JSON.parse(data) : fallback;
        } catch {
          return fallback;
        }
      };

      property = safeParse(property, {});
      images = safeParse(images, []);
      other_images = safeParse(other_images, []);

      const finalImages = [...images, ...imagePaths];
      const finalOtherImages = [...other_images, ...otherImagePaths];

      const { price, isDiscount, delivery_days, storage_days, subtitle } =
        req.body;

      // 3️⃣ order_key logikasi
      let orderKey = req.body.order_key
        ? parseInt(req.body.order_key, 10)
        : null;

      if (orderKey && !isNaN(orderKey)) {
        // Agar shu tartib (order_key) band bo‘lsa — keyingilarni surib chiqamiz
        await Catalog.increment("order_key", {
          by: 1,
          where: { order_key: { [Op.gte]: orderKey } },
        });
      } else {
        // Foydalanuvchi kiritmagan bo‘lsa, oxirgi raqamdan keyingisini qo‘yamiz
        const maxOrder = await Catalog.max("order_key");
        orderKey = (maxOrder || 0) + 1;
      }

      // 4️⃣ Yangi catalog yaratish
      const catalog = await Catalog.create({
        name,
        title,
        subtitle,
        description,
        property,
        images: finalImages,
        other_images: finalOtherImages,
        price,
        isDiscount,
        delivery_days,
        storage_days,
        order_key: orderKey, // 👉 order_key qo‘shildi
      });

      res.json({
        success: true,
        message: "Catalog saqlandi",
        data: catalog,
      });
    } catch (error) {
      console.error("Xatolik:", error);
      res.status(500).json({ error: "Xatolik yuz berdi" });
    }
  }
);

router.put(
  "/update/:id",
  upload.fields([
    { name: "updatedImages" },
    { name: "newImages" },
    { name: "updatedOtherImages" },
    { name: "newOtherImages" },
  ]),
  async (req, res) => {
    try {
      const safeParse = (data, fallback) => {
        try {
          return data ? JSON.parse(data) : fallback;
        } catch {
          return fallback;
        }
      };

      // 🔹 Asosiy images
      let imagesFromClient = safeParse(req.body.images, []);

      if (req.files?.updatedImages) {
        req.files.updatedImages.forEach((file, idx) => {
          const newUrl = `${process.env.BACKEND_URL}/${file.filename}`;
          if (imagesFromClient[idx]) {
            imagesFromClient[idx] = newUrl;
          } else {
            imagesFromClient.push(newUrl);
          }
        });
      }

      if (req.files?.newImages) {
        const newImageUrls = req.files.newImages.map(
          (file) => `${process.env.BACKEND_URL}/${file.filename}`
        );
        imagesFromClient.push(...newImageUrls);
      }

      // 🔹 Other images
      let otherImagesFromClient = safeParse(req.body.other_images, []);

      if (req.files?.updatedOtherImages) {
        req.files.updatedOtherImages.forEach((file, idx) => {
          const newUrl = `${process.env.BACKEND_URL}/${file.filename}`;
          if (otherImagesFromClient[idx]) {
            otherImagesFromClient[idx] = newUrl;
          } else {
            otherImagesFromClient.push(newUrl);
          }
        });
      }

      if (req.files?.newOtherImages) {
        const newOtherImageUrls = req.files.newOtherImages.map(
          (file) => `${process.env.BACKEND_URL}/${file.filename}`
        );
        otherImagesFromClient.push(...newOtherImageUrls);
      }

      // 🔹 JSON maydonlar
      const property = safeParse(req.body.property, {});

      // 🔹 order_key logikasi
      let orderKey = req.body.order_key
        ? parseInt(req.body.order_key, 10)
        : null;

      if (orderKey && !isNaN(orderKey)) {
        // Shu tartibni boshqa cataloglar bilan moslashtirish
        await Catalog.increment("order_key", {
          by: 1,
          where: {
            order_key: { [Op.gte]: orderKey },
            id: { [Op.ne]: req.params.id }, // o‘zini surish emas
          },
        });
      } else {
        // Kiritilmagan bo‘lsa, oxirgi raqamdan keyingisini qo‘yamiz
        const maxOrder = await Catalog.max("order_key");
        orderKey = (maxOrder || 0) + 1;
      }

      const {
        name,
        title,
        subtitle,
        description,
        price,
        isDiscount,
        delivery_days,
        storage_days,
      } = req.body;

      const [affectedCount, updatedRows] = await Catalog.update(
        {
          name,
          title,
          subtitle,
          description,
          property,
          images: imagesFromClient,
          other_images: otherImagesFromClient,
          price,
          isDiscount,
          delivery_days,
          storage_days,
          order_key: orderKey, // 🔹 order_key qo‘shildi
        },
        {
          where: { id: req.params.id },
          returning: true,
        }
      );

      if (affectedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Catalog topilmadi",
        });
      }

      res.json({
        success: true,
        message: "Catalog muvaffaqiyatli yangilandi",
        data: updatedRows[0],
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ success: false, message: "Server xatoligi" });
    }
  }
);
router.post("/home", setCatalogHomeCont);
router.delete("/home/:id", unsetCatalogHomeCont);

export default router;
