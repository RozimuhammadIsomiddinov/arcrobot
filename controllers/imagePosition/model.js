import Catalog from "../../models/catalog.js";
import ImagePosition from "../../models/imageposition.js";

export const createImagePosition = async (data) => {
  const { catalog_id, image_url, title, top, left_pos, description, image } =
    data;
  const catalog = await Catalog.findByPk(catalog_id);
  if (!catalog) throw new Error("catalog not found");
  return await ImagePosition.create({
    catalog_id,
    image_url,
    title,
    top,
    left_pos,
    description,
    image,
  });
};

export const selectImagePosition = async (id) => {
  return await ImagePosition.findByPk(id);
};
