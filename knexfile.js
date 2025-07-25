// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

import dotenv from "dotenv";
dotenv.config();
const { DB_PASSWORD, DB_NAME, DB_HOST, DB_USERNAME } = process.env;

export default {
  client: "pg",
  connection: {
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
  },
  migrations: {
    directory: "./migrations",
  },
};
