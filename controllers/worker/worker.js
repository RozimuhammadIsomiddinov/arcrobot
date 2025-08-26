import Worker from "../../models/worker.js";

export const createWorker = async (data) => {
  return await Worker.create(data);
};

export const selectWorker = async (page = 1, pageSize = 10) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Worker.findAndCountAll({
    offset,
    limit: pageSize,
    order: [["createdAt", "DESC"]],
  });

  return {
    total: count,
    page,
    totalPages: Math.ceil(count / pageSize),
    data: rows,
  };
};

export const selectWorkerById = async (id) => {
  return await Worker.findByPk(id);
};

export const updateWorker = async (id, data) => {
  const worker = await Worker.findByPk(id);
  if (!worker) return null;
  return await worker.update(data);
};

export const deleteWorker = async (id) => {
  const worker = await Worker.findByPk(id);
  if (!worker) return null;
  await worker.destroy();
  return worker;
};
