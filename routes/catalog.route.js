import express from "express";
import {
  getAllCatalogCont,
  getCatalogByIDCont,
} from "../controllers/catalog/catalog.js";
import upload from "../middleware/multer.js";
import Catalog from "../models/catalog.js";

const router = express.Router();

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
      if (
        (!req.files?.files || req.files.files.length === 0) &&
        (!req.files?.other_files || req.files.other_files.length === 0)
      ) {
        return res.status(400).json({ error: "Hech qanday fayl yuklanmadi" });
      }

      // asosiy images
      const imagePaths = req.files?.files
        ? req.files.files.map(
            (file) => `${process.env.BACKEND_URL}/${file.filename}`
          )
        : [];

      // qo'shimcha other_images
      const otherImagePaths = req.files?.other_files
        ? req.files.other_files.map(
            (file) => `${process.env.BACKEND_URL}/${file.filename}`
          )
        : [];

      let { name, title, description, property, images, other_images } =
        req.body;

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

      try {
        other_images = other_images ? JSON.parse(other_images) : [];
      } catch {
        other_images = [];
      }

      const finalImages = [...images, ...imagePaths];
      const finalOtherImages = [...other_images, ...otherImagePaths];

      const catalog = await Catalog.create({
        name,
        title,
        description,
        images: finalImages,
        other_images: finalOtherImages,
        property,
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
    { name: "updatedImages" }, // eski asosiy rasmni yangilash
    { name: "newImages" }, // yangi asosiy rasm qo‘shish
    { name: "updatedOtherImages" }, // eski qo‘shimcha rasmni yangilash
    { name: "newOtherImages" }, // yangi qo‘shimcha rasm qo‘shish
  ]),
  async (req, res) => {
    try {
      // ===== Asosiy images =====
      let imagesFromClient = req.body.images ? JSON.parse(req.body.images) : [];

      if (req.files?.updatedImages) {
        req.files.updatedImages.forEach((file, idx) => {
          const newUrl = `${process.env.BACKEND_URL}/${file.filename}`;
          imagesFromClient.splice(idx, 1, newUrl); // index bo‘yicha almashtirish
        });
      }

      if (req.files?.newImages) {
        const newImageUrls = req.files.newImages.map(
          (file) => `${process.env.BACKEND_URL}/${file.filename}`
        );
        imagesFromClient.push(...newImageUrls);
      }

      // ===== Qo‘shimcha other_images =====
      let otherImagesFromClient = req.body.other_images
        ? JSON.parse(req.body.other_images)
        : [];

      if (req.files?.updatedOtherImages) {
        req.files.updatedOtherImages.forEach((file, idx) => {
          const newUrl = `${process.env.BACKEND_URL}/${file.filename}`;
          otherImagesFromClient.splice(idx, 1, newUrl); // index bo‘yicha almashtirish
        });
      }

      if (req.files?.newOtherImages) {
        const newOtherImageUrls = req.files.newOtherImages.map(
          (file) => `${process.env.BACKEND_URL}/${file.filename}`
        );
        otherImagesFromClient.push(...newOtherImageUrls);
      }

      // ===== Property parse =====
      let property = {};
      try {
        property = req.body.property ? JSON.parse(req.body.property) : {};
      } catch {
        property = {};
      }

      // ===== Update DB =====
      const [_, updatedRows] = await Catalog.update(
        {
          name: req.body.name,
          title: req.body.title,
          description: req.body.description,
          property,
          images: imagesFromClient,
          other_images: otherImagesFromClient,
        },
        {
          where: { id: req.params.id },
          returning: true,
        }
      );

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

export default router;
