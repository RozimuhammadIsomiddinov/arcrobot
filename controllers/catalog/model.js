import Catalog from "../../models/catalog.js";
import ImagePosition from "../../models/imageposition.js";

const getAllCatalog = async (page = 1, pageSize = 10000) => {
  const offset = (page - 1) * pageSize;

  const totalRecords = await Catalog.count();

  const data = await Catalog.findAll({
    limit: pageSize,
    offset,
    order_key: [["order_key", "DESC"]],
  });

  const totalPages = Math.ceil(totalRecords / pageSize);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return {
    data,
    pagination: {
      total_records: totalRecords,
      current_page: page,
      total_pages: totalPages,
      next_page: nextPage,
      prev_page: prevPage,
    },
  };
};

const parsePgArray = (pgArrayString) => {
  if (!pgArrayString) return [];
  if (Array.isArray(pgArrayString)) return pgArrayString;
  return pgArrayString
    .replace(/^{|}$/g, "")
    .split(",")
    .map((url) => url.replace(/^"|"$/g, ""));
};

const getCatalogByID = async (id) => {
  const catalog = await Catalog.findByPk(id);

  if (!catalog) return null;

  let imagesArray = [];

  if (Array.isArray(catalog.images)) {
    imagesArray = catalog.other_images;
  } else if (typeof catalog.images === "string") {
    imagesArray = parsePgArray(catalog.other_images);
  }

  const imagesWithPositions = await Promise.all(
    imagesArray.map(async (imgUrl) => {
      const positions = await ImagePosition.findAll({
        where: { image_url: imgUrl },
      });
      return {
        image_url: imgUrl,
        positions,
      };
    })
  );

  return {
    ...catalog.toJSON(),
    images_data: imagesWithPositions,
  };
};

const setCatalogHome = async (id) => {
  const catalog = await Catalog.findByPk(id);
  if (!catalog) return null;

  catalog.isHome = true;
  await catalog.save();

  return catalog;
};

const unsetCatalogHome = async (id) => {
  const catalog = await Catalog.findByPk(id);
  if (!catalog) return null;

  catalog.isHome = false;
  await catalog.save();

  return catalog;
};

const getHomeCatalogs = async () => {
  const catalogs = await Catalog.findAll({
    where: { isHome: true },
    order: [["createdAt", "DESC"]],
  });

  // Images data bilan birga qaytarish (getCatalogByID dagi kabi)
  const catalogsWithImages = await Promise.all(
    catalogs.map(async (catalog) => {
      let imagesArray = Array.isArray(catalog.images)
        ? catalog.other_images
        : [];

      const imagesWithPositions = await Promise.all(
        imagesArray.map(async (imgUrl) => {
          const positions = await ImagePosition.findAll({
            where: { image_url: imgUrl },
          });
          return {
            image_url: imgUrl,
            positions,
          };
        })
      );

      return {
        ...catalog.toJSON(),
        images_data: imagesWithPositions,
      };
    })
  );

  return catalogsWithImages;
};

export {
  getAllCatalog,
  getCatalogByID,
  setCatalogHome,
  unsetCatalogHome,
  getHomeCatalogs,
};
