import Blog from "../../models/blog.js";
import { selectBlog, selectBlogID, updateBlog } from "./model.js";
import { Op } from "sequelize";

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
    author_name,
    author_description,
    author_old_image,
    author_phone,
    order_key: orderFromBody, // foydalanuvchi yuborgan order_key
  } = req.body;

  try {
    const existingBlog = await selectBlogID(id);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // ==== IMAGES ====
    let images = existingBlog.images || [];
    const imagesFromClient = imagesJSON ? JSON.parse(imagesJSON) : [];

    // yangilangan rasmlar
    if (req.files?.updatedImages) {
      req.files.updatedImages.forEach((file, idx) => {
        const newUrl = `${process.env.BACKEND_URL}/${file.filename}`;
        imagesFromClient.splice(idx, 1, newUrl);
      });
    }

    // yangi rasmlar
    if (req.files?.newImages) {
      const newImagesUrls = req.files.newImages.map(
        (file) => `${process.env.BACKEND_URL}/${file.filename}`
      );
      imagesFromClient.push(...newImagesUrls);
    }
    images = imagesFromClient;

    // ==== AUTHOR ====
    const authorNameFinal = author_name || existingBlog.author_name || "";
    const authorDescriptionFinal =
      author_description || existingBlog.author_description || "";
    const authorPhoneFinal = author_phone || existingBlog.author_phone || "";

    let authorImage = existingBlog.author_image || "";
    if (req.files?.author_image?.length > 0) {
      authorImage = `${process.env.BACKEND_URL}/${req.files.author_image[0].filename}`;
    } else if (author_old_image) {
      try {
        authorImage = JSON.parse(author_old_image);
      } catch {
        authorImage = author_old_image;
      }
    }

    // ==== ORDER ====
    let finalOrder = existingBlog.order_key; // eski qiymat
    if (orderFromBody && !isNaN(orderFromBody)) {
      const newOrder = parseInt(orderFromBody, 10);

      if (newOrder !== existingBlog.order_key) {
        if (newOrder < existingBlog.order_key) {
          // yuqoriga ko‘tarilsa
          await Blog.increment("order_key", {
            by: 1,
            where: {
              order_key: {
                [Op.gte]: newOrder,
                [Op.lt]: existingBlog.order_key,
              },
              id: { [Op.ne]: id },
            },
          });
        } else {
          // pastga tushirilsa
          await Blog.decrement("order_key", {
            by: 1,
            where: {
              order_key: {
                [Op.lte]: newOrder,
                [Op.gt]: existingBlog.order_key,
              },
              id: { [Op.ne]: id },
            },
          });
        }
        finalOrder = newOrder;
      }
    }

    // ==== YANGILASH ====
    const updateData = {
      title,
      subtitles,
      description,
      images,
      author_name: authorNameFinal,
      author_description: authorDescriptionFinal,
      author_image: authorImage,
      author_phone: authorPhoneFinal,
      order_key: finalOrder,
    };

    const updatedBlog = await updateBlog(id, updateData);
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(updatedBlog);
  } catch (e) {
    console.error("Update blog error:", e);
    return res.status(500).json({ error: e.message });
  }
};

export { selectAllBlogCont, selectBlogByIDCont, updateBlogCont };
