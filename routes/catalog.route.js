import express from "express";
import {
  getAllCatalogCont,
  getCatalogByIDCont,
} from "../controllers/catalog/catalog.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Catalog
 *   description: Catalog management
 */

/**
 * @swagger
 * /catalog:
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
 * /catalog/{id}:
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

export default router;
