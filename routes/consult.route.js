import express from "express";
import {
  createConsultCont,
  selectALlCont,
  selectByIDCont,
} from "../controllers/consult/consult.js";
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Consult
 *   description: Consultation management
 */

/**
 * @swagger
 * /consult:
 *   get:
 *     summary: Get all consultations
 *     tags: [Consult]
 *     responses:
 *       200:
 *         description: List of all consultations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consult'
 */

/**
 * @swagger
 * /consult/{id}:
 *   get:
 *     summary: Get consultation by ID
 *     tags: [Consult]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Consultation ID
 *     responses:
 *       200:
 *         description: Consultation object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consult'
 *       404:
 *         description: Consultation not found
 */

/**
 * @swagger
 * /consult/create:
 *   post:
 *     summary: Create a new consultation
 *     tags: [Consult]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateConsult'
 *     responses:
 *       200:
 *         description: Consultation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consult'
 *       400:
 *         description: Missing fields
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Consult:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         phone_number:
 *           type: string
 *           example: "+998901234567"
 *         email:
 *           type: string
 *           example: johndoe@gmail.com
 *         reason:
 *           type: string
 *           example: Consultation about health
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-07-29T12:34:56Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-07-29T12:34:56Z
 *
 *     CreateConsult:
 *       type: object
 *       required:
 *         - name
 *         - phone_number
 *         - email
 *         - reason
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         phone_number:
 *           type: string
 *           example: "+998901234567"
 *         email:
 *           type: string
 *           example: johndoe@gmail.com
 *         reason:
 *           type: string
 *           example: Consultation about health
 */

router.get("/", selectALlCont);
router.get("/:id", selectByIDCont);
router.post("/create", createConsultCont);

export default router;
