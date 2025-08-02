import { selectBlog, selectBlogID } from "./model.js";

const selectAllBlogCont = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {
    const result = await selectBlog(Number(page), Number(pageSize));
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const selectBlogByIDCont = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await selectBlogID(id);
    if (!result) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export { selectAllBlogCont, selectBlogByIDCont };
