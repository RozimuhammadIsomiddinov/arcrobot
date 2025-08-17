import Catalog from "../../models/catalog.js";
import ImagePosition from "../../models/imageposition.js";

export const createImagePosition = async (data) => {
  const { catalog_id, image_url, title, top, left_pos, description, image } =
    data;
  const catalog = await Catalog.findByPk(parseInt(catalog_id));
  console.log(data);
  console.log(catalog);
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

export const selectImagePosition = async (image_url) => {
  return await ImagePosition.findAll({
    where: { image_url },
  });
};
