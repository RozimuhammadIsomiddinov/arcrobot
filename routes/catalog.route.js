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
      // Fayllar kelmagan bo‘lsa
      if (
        (!req.files?.files || req.files.files.length === 0) &&
        (!req.files?.other_files || req.files.other_files.length === 0)
      ) {
        return res.status(400).json({ error: "Hech qanday fayl yuklanmadi" });
      }

      // Asosiy images
      const imagePaths = req.files?.files
        ? req.files.files.map(
            (file) => `${process.env.BACKEND_URL}/${file.filename}`
          )
        : [];

      // Qo‘shimcha other_images
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
      });

      res.json({ success: true, data: catalog });
    } catch (error) {
      console.error(error);
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

      const property = safeParse(req.body.property, {});

      const { price, isDiscount, delivery_days, storage_days, subtitle } =
        req.body;

      const [affectedCount, updatedRows] = await Catalog.update(
        {
          name: req.body.name,
          title: req.body.title,
          subtitle: subtitle,
          description: req.body.description,
          property,
          images: imagesFromClient,
          other_images: otherImagesFromClient,
          price,
          isDiscount,
          delivery_days,
          storage_days,
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
        message: "Каталог успешно обновлен",
        data: updatedRows[0],
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
  }
);

router.post("/home", setCatalogHomeCont);
router.delete("/home/:id", unsetCatalogHomeCont);

export default router;
