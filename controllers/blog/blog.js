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
  const {
    title,
    subtitles,
    description,
    images: imagesJSON,
    author_name, // authorName -> author_name
    author_description, // authorDescription -> author_description
    author_old_image,
  } = req.body;

  const existingBlog = await selectBlogID(id);
  if (!existingBlog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  // 🖼 Images update logic
  let images = existingBlog.images || [];
  const imagesFromClient = imagesJSON ? JSON.parse(imagesJSON) : [];

  if (req.files?.updatedImages) {
    req.files.updatedImages.forEach((file, idx) => {
      const newUrl = `${process.env.BACKEND_URL}/${file.filename}`;
      imagesFromClient.splice(idx, 1, newUrl);
    });
  }

  if (req.files?.newImages) {
    const newImagesUrls = req.files.newImages.map(
      (file) => `${process.env.BACKEND_URL}/${file.filename}`
    );
    imagesFromClient.push(...newImagesUrls);
  }

  images = imagesFromClient;

  // 👤 Author update logic
  let authorNameFinal = author_name || existingBlog.author_name || "";
  let authorDescriptionFinal =
    author_description || existingBlog.author_description || "";

  let authorImage = existingBlog.author_image || "";

  // 1️⃣ Agar yangi fayl kelsa → uni ishlatamiz
  if (req.files?.author_image && req.files.author_image.length > 0) {
    authorImage = `${process.env.BACKEND_URL}/${req.files.author_image[0].filename}`;
  }
  // 2️⃣ Agar `author_old_image` kelgan bo'lsa → uni ishlatamiz
  else if (author_old_image) {
    try {
      authorImage = JSON.parse(author_old_image);
    } catch {
      authorImage = author_old_image;
    }
  }
  // 3️⃣ Agar ikkalasi ham bo'lmasa → DB'dagi mavjud saqlanib qoladi

  // ✅ Oxirgi updateData
  const updateData = {
    title,
    subtitles,
    description,
    images,
    author_name: authorNameFinal,
    author_description: authorDescriptionFinal,
    author_image: authorImage,
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
