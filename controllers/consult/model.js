import Order from "../../models/order.js";

const selectAll = async () => {
  return await Order.findAll();
};

const selectByID = async (id) => {
  return await Order.findByPk(id);
};

const createConsult = async (data) => {
  return await Order.create({
    name: data.name,
    phone_number: data.phone_number,
    email: data.email,
    reason: data.reason,
  });
};

export { selectAll, selectByID, createConsult };
