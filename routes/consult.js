import express from "express";
import {
  createConsultCont,
  selectALlCont,
  selectByIDCont,
} from "../controllers/consult/consult.js";
const router = express.Router();
router.get("/", selectALlCont);
router.get("/:id", selectByIDCont);
router.post("/create", createConsultCont);

export default router;
