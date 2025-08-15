import express from "express";

import dotenv from "dotenv";
import {
  createImagePositionCont,
  selectImagePositionByIDCont,
} from "../controllers/imagePosition/imagePosition.js";
import upload from "../middleware/multer.js";
dotenv.config();
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: ImagePosition
 *   description: Управление позициями изображений
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ImagePosition:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         catalog_id:
 *           type: integer
 *           example: 10
 *         image_url:
 *           type: string
 *           example: "http://example.com/uploads/abc123-image.jpg"
 *         title:
 *           type: string
 *           example: "Hotspot 1"
 *         description:
 *           type: string
 *           example: "This part describes the hotspot."
 *         top:
 *           type: string
 *           example: "20%"
 *         left_pos:
 *           type: string
 *           example: "30%"
 *         image:
 *           type: string
 *           example: "http://example.com/uploads/icon.png"
 */

/**
 * @swagger
 * /image-position/create:
 *   post:
 *     summary: Создать новую позицию изображения с загрузкой файла
 *     tags: [ImagePosition]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image_url
 *               - catalog_id
 *               - image
 *             properties:
 *               catalog_id:
 *                 type: integer
 *                 example: 10
 *               image_url:
 *                 type: string
 *               title:
 *                 type: string
 *                 example: "Hotspot 1"
 *               description:
 *                 type: string
 *                 example: "Описание позиции"
 *               top:
 *                 type: string
 *                 example: "20%"
 *               left_pos:
 *                 type: string
 *                 example: "30%"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Позиция успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImagePosition'
 *       400:
 *         description: Ошибка валидации
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /image-position/{image_url}:
 *   get:
 *     summary: Получить позицию изображения по ID
 *     tags: [ImagePosition]
 *     parameters:
 *       - in: path
 *         name: image_url
 *         schema:
 *           type: string
 *         required: true
 *         description: ID позиции изображения
 *     responses:
 *       200:
 *         description: Позиция изображения
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImagePosition'
 *       404:
 *         description: Позиция не найдена
 */

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      const fileUrl = `${process.env.BACKEND_URL}/${req.file.filename}`;
      data.image = fileUrl; // shu yerda image maydonni ham to'ldiramiz
    }

    if (!data.catalog_id || !data.image_url) {
      return res
        .status(400)
        .json({ message: "catalog_id va image_url majburiy" });
    }

    const newPosition = await createImagePositionCont({ body: data }, res);
    return newPosition;
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
});

router.get("/:image_url", selectImagePositionByIDCont);

export default router;
