import express from "express";
import {
  selectAllBlogCont,
  selectBlogByIDCont,
  updateBlogCont,
} from "../controllers/blog/blog.js";
import Blog from "../models/blog.js";
import upload from "../middleware/multer.js";

import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog management
 */

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all blogs with pagination
 *     tags: [Blog]
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
 *         description: Number of blogs per page
 *     responses:
 *       200:
 *         description: List of blogs with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total_records:
 *                       type: integer
 *                       example: 100
 *                     current_page:
 *                       type: integer
 *                       example: 1
 *                     total_pages:
 *                       type: integer
 *                       example: 10
 *                     next_page:
 *                       type: integer
 *                       example: 2
 *                     prev_page:
 *                       type: integer
 *                       example: null
 */

/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     summary: Get blog by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "My First Blog"
 *         subtitles:
 *           type: string
 *           example: "A brief intro"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["img1.jpg", "img2.jpg"]
 *         description:
 *           type: string
 *           example: "This is the detailed content of the blog."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-08-01T12:34:56Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-08-01T12:34:56Z
 */

router.get("/", selectAllBlogCont);
router.get("/:id", selectBlogByIDCont);
// upload.fields ishlatamiz
router.post(
  "/create",
  upload.fields([
    { name: "files", maxCount: 10 }, // blog rasmlari
    { name: "author_image", maxCount: 1 }, // muallif rasmi
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files["files"]) {
        return res.status(400).json({ error: "Hech qanday fayl yuklanmadi" });
      }

      // Blog rasmlarini olish
      const imagePaths = req.files["files"].map(
        (file) => `${process.env.BACKEND_URL}/${file.filename}`
      );

      // Muallif rasmi (agar bo‘lsa)
      let authorImagePath = null;
      if (req.files["author_image"] && req.files["author_image"][0]) {
        authorImagePath = `${process.env.BACKEND_URL}/${req.files["author_image"][0].filename}`;
      }

      // Yangi blog yaratish
      const newBlog = await Blog.create({
        title: req.body.title,
        subtitles: req.body.subtitles,
        description: req.body.description,
        images: imagePaths,

        author_name: req.body.author_name,
        author_image: authorImagePath, // multer orqali yuklangan fayl
        author_description: req.body.author_description,

        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.json({
        success: true,
        message: "Fayllar va ma'lumotlar saqlandi",
        data: newBlog,
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
    { name: "newImages", maxCount: 10 },
    { name: "updatedImages", maxCount: 10 },
    { name: "author_image", maxCount: 1 }, // 👈 author image qo‘shildi
  ]),
  updateBlogCont
);

export default router;
