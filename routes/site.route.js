import express from "express";
import {
  getAllSitesCont,
  getSiteByIDCont,
  updateSiteCont,
} from "../controllers/site/site.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sites
 *   description: Sites management
 */

/**
 * @swagger
 * /sites:
 *   get:
 *     summary: Get all sites with pagination
 *     tags: [Sites]
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
 *         description: Number of sites per page
 *     responses:
 *       200:
 *         description: List of sites with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Site'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total_records:
 *                       type: integer
 *                       example: 50
 *                     current_page:
 *                       type: integer
 *                       example: 1
 *                     total_pages:
 *                       type: integer
 *                       example: 5
 *                     next_page:
 *                       type: integer
 *                       example: 2
 *                     prev_page:
 *                       type: integer
 *                       example: null
 */

/**
 * @swagger
 * /sites/{id}:
 *   get:
 *     summary: Get site by ID
 *     tags: [Sites]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Site ID
 *     responses:
 *       200:
 *         description: Site object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Site'
 *       404:
 *         description: Site not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Site:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "OpenAI"
 *         link:
 *           type: string
 *           example: "https://openai.com"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-08-01T12:34:56Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-08-01T12:34:56Z
 */

router.get("/", getAllSitesCont);
router.get("/:id", getSiteByIDCont);
router.put("/update/:id", updateSiteCont);

export default router;
