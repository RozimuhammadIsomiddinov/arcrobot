import {
  getAllCatalog,
  getCatalogByID,
  getHomeCatalogs,
  setCatalogHome,
  unsetCatalogHome,
} from "./model.js";

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

const setCatalogHomeCont = async (req, res) => {
  const { id } = req.body; // POST so'rovda catalog id keladi
  if (!id) return res.status(400).json({ message: "Catalog id required" });

  try {
    const result = await setCatalogHome(id);
    if (!result) return res.status(404).json({ message: "Catalog not found" });

    return res
      .status(200)
      .json({ message: "Catalog set as home", data: result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const unsetCatalogHomeCont = async (req, res) => {
  const { id } = req.params; // DELETE so'rovda URL orqali id keladi
  try {
    const result = await unsetCatalogHome(id);
    if (!result) return res.status(404).json({ message: "Catalog not found" });

    return res
      .status(200)
      .json({ message: "Catalog removed from home", data: result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const getHomeCatalogsCont = async (req, res) => {
  try {
    const result = await getHomeCatalogs();
    return res.status(200).json({ data: result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export {
  getAllCatalogCont,
  getCatalogByIDCont,
  setCatalogHomeCont,
  unsetCatalogHomeCont,
  getHomeCatalogsCont,
};
