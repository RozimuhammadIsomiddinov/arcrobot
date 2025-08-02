import Blog from "../../models/blog.js";

const selectBlog = async (page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;

  const totalRecords = await Blog.count();

  const data = await Blog.findAll({
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

const selectBlogID = async (id) => {
  return await Blog.findByPk(id);
};

export { selectBlog, selectBlogID };
