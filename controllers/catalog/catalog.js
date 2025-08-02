import { getAllCatalog, getCatalogByID } from "./model.js";

const getAllCatalogCont = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {
    const result = await getAllCatalog(Number(page), Number(pageSize));
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const getCatalogByIDCont = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getCatalogByID(id);
    if (!result) {
      return res.status(404).json({ message: "Catalog not found" });
    }
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export { getAllCatalogCont, getCatalogByIDCont };
