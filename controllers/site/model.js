import Sites from "../../models/sites.js";

const getAllSites = async (page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;

  const totalRecords = await Sites.count();

  const data = await Sites.findAll({
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

const getSiteByID = async (id) => {
  return await Sites.findByPk(id);
};
const updateSite = async (id, data) => {
  const site = await Sites.findByPk(id);
  if (!site) return null;

  await site.update({
    name: data.name || site.name,
    link: data.link || site.link,
  });

  return site;
};

export { getAllSites, getSiteByID, updateSite };
