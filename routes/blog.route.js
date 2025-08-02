import express from "express";
import {
  selectAllBlogCont,
  selectBlogByIDCont,
} from "../controllers/blog/blog.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog management
 */

/**
 * @swagger
 * /blog:
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
 * /blog/{id}:
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

export default router;
