import dotenv from "dotenv";
dotenv.config();
import db from "../../config/dbconfig.js";

//const db = knex(data);

const selectAllQuery = `
        SELECT *FROM "order";
`;

const selectByIDQuery = `
        SELECT *FROM "order" WHERE id = ?;
`;

const createConsultQuery = `
        INSERT INTO "order"(
        name,
        phone_number,
        email,
        reason
        )
        VALUES(?,?,?,?)
        RETURNING*;
`;

const selectAll = async () => {
  const res = await db.raw(selectAllQuery);
  return res.rows;
};
const selectByID = async (id) => {
  const res = await db.raw(selectByIDQuery, [id]);
  return res.rows;
};

const createConsult = async (data) => {
  const res = await db.raw(createConsultQuery, [
    data.name,
    data.phone_number,
    data.email,
    data.reason,
  ]);
  return res.rows[0];
};

export { selectAll, selectByID, createConsult };
