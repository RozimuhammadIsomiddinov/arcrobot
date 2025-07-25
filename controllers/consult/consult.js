import { createConsult, selectAll, selectByID } from "./model.js";

const selectALlCont = async (req, res) => {
  try {
    const result = await selectAll();
    return res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const selectByIDCont = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await selectByID(id);
    return res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const createConsultCont = async (req, res) => {
  const { name, phone_number, email, reason } = req.body;
  if (!name || !phone_number || !email || !reason)
    return res.status(400).json({ message: "fill all fields" });
  try {
    const result = await createConsult({ name, phone_number, email, reason });
    return res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
export { selectALlCont, selectByIDCont, createConsultCont };
