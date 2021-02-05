// Update with your config settings.

require("dotenv").config();

export const development = {
  client: "postgresql",
  connection: {
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};
