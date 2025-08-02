import Catalog from "../../models/catalog.js";

const getAllCatalog = async (page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;

  const totalRecords = await Catalog.count();

  const data = await Catalog.findAll({
    limit: pageSize,
    offset,
    order: [["createdAt", "DESC"]],
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

const getCatalogByID = async (id) => {
  return await Catalog.findByPk(id);
};

export { getAllCatalog, getCatalogByID };
