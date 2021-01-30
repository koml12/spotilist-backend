import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable("user", (table) => {
    table.increments("id");
    table.string("spotify_id");
    table.string("auth_token");
    table.string("refresh_token");
    table.dateTime("expiration_date");
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable("user");
}
