/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
function up(knex) {
  return knex.raw(`
      CREATE TABLE IF NOT EXISTS "order" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(25) NOT NULL,
        email VARCHAR(100),
        reason VARCHAR(1024),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
function down(knex) {
  return knex.raw(`
      DROP TABLE IF EXISTS "order";
    `);
}

export { up, down };
