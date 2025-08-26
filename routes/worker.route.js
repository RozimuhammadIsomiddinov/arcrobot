import express from "express";
import {
  createWorkerCont,
  deleteWorkerCont,
  selectAllWorkerCont,
  selectWorkerByIdCont,
  updateWorkerCont,
} from "../controllers/worker/model.js";
import upload from "../middleware/multer.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Worker
 *   description: Worker management
 */

/**
 * @swagger
 * /api/worker:
 *   get:
 *     summary: Get all workers
 *     tags: [Worker]
 *     responses:
 *       200:
 *         description: List of workers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Worker'
 */

/**
 * @swagger
 * /api/worker/{id}:
 *   get:
 *     summary: Get worker by ID
 *     tags: [Worker]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Worker ID
 *     responses:
 *       200:
 *         description: Worker object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 *       404:
 *         description: Worker not found
 */

/**
 * @swagger
 * /api/worker:
 *   post:
 *     summary: Create a new worker
 *     tags: [Worker]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               worker_type:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Worker created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 */

/**
 * @swagger
 * /api/worker/{id}:
 *   put:
 *     summary: Update a worker
 *     tags: [Worker]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Worker ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               worker_type:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Worker updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Worker'
 *       404:
 *         description: Worker not found
 */

/**
 * @swagger
 * /api/worker/{id}:
 *   delete:
 *     summary: Delete a worker
 *     tags: [Worker]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Worker ID
 *     responses:
 *       200:
 *         description: Worker deleted
 *       404:
 *         description: Worker not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Worker:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "John Doe"
 *         worker_type:
 *           type: string
 *           example: "Engineer"
 *         description:
 *           type: string
 *           example: "This is a detailed description about the worker."
 *         image:
 *           type: string
 *           example: "http://localhost:7007/uploads/worker1.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-26T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-26T12:34:56Z"
 */

router.post("/", upload.single("image"), createWorkerCont);
router.get("/", selectAllWorkerCont);
router.get("/:id", selectWorkerByIdCont);
router.put("/:id", upload.single("image"), updateWorkerCont);
router.delete("/:id", deleteWorkerCont);

export default router;
