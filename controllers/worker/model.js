import {
  createWorker,
  selectWorker,
  selectWorkerById,
  updateWorker,
  deleteWorker,
} from "./worker.js";
import dotenv from "dotenv";
dotenv.config();
export const createWorkerCont = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Hech qanday fayl yuklanmadi" });
  }

  try {
    const { name, description, worker_type } = req.body;
    const image = req.file
      ? `${process.env.BACKEND_URL}/${req.file.filename}`
      : null;

    const worker = await createWorker({
      name,
      description,
      worker_type,
      image,
    });
    return res.status(201).json(worker);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const selectAllWorkerCont = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {
    const result = await selectWorker(Number(page), Number(pageSize));
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const selectWorkerByIdCont = async (req, res) => {
  try {
    const worker = await selectWorkerById(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });
    return res.status(200).json(worker);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
export const updateWorkerCont = async (req, res) => {
  try {
    const { name, description, worker_type, image: oldImage } = req.body;

    // Yangi rasm keldi -> req.file ishlatiladi
    let image = oldImage; // default eski rasm
    if (req.file) {
      image = `${process.env.BACKEND_URL}/${req.file.filename}`;
    }

    const worker = await updateWorker(req.params.id, {
      name,
      description,
      worker_type,
      image,
    });

    if (!worker) return res.status(404).json({ message: "Worker not found" });

    return res.status(200).json(worker);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};

export const deleteWorkerCont = async (req, res) => {
  try {
    const worker = await deleteWorker(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });
    return res.status(200).json({ message: "Worker deleted successfully" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
