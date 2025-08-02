import { getAllSites, getSiteByID } from "./model.js";

const getAllSitesCont = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {
    const result = await getAllSites(Number(page), Number(pageSize));
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const getSiteByIDCont = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getSiteByID(id);
    if (!result) {
      return res.status(404).json({ message: "Site not found" });
    }
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export { getAllSitesCont, getSiteByIDCont };
