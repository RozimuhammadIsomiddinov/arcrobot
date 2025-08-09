import { selectBlog, selectBlogID, updateBlog } from "./model.js";

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
const updateBlogCont = async (req, res) => {
  const { id } = req.params;
  const { title, subtitles, description, images: imagesJSON } = req.body;

  const existingBlog = await selectBlogID(id);
  if (!existingBlog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  let images = existingBlog.images || [];

  // Frontenddan o'chirilmagan eski rasm URLlari JSON ko'rinishida keladi
  const imagesFromClient = imagesJSON ? JSON.parse(imagesJSON) : [];

  // Yangilangan rasm fayllarini eski URLlar bilan almashtirish
  if (req.files?.updatedImages) {
    req.files.updatedImages.forEach((file, idx) => {
      const newUrl = `${process.env.BACKEND_URL}/${file.filename}`;
      imagesFromClient.splice(idx, 1, newUrl);
    });
  }

  // Yangi rasm fayllarini massivga qo'shish
  if (req.files?.newImages) {
    const newImagesUrls = req.files.newImages.map(
      (file) => `${process.env.BACKEND_URL}/${file.filename}`
    );
    imagesFromClient.push(...newImagesUrls);
  }

  // Yangilangan images massivini tayyorlash
  images = imagesFromClient;

  const updateData = {
    title,
    subtitles,
    description,
    images,
  };

  try {
    const updatedBlog = await updateBlog(id, updateData);
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json(updatedBlog);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export { selectAllBlogCont, selectBlogByIDCont, updateBlogCont };
