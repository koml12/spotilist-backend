import knex from "knex";
import { development } from "../../knexfile";
import { injectable } from "tsyringe";

@injectable()
class DataProvider {
  private dbClient = knex(development);

  getDbClient(): knex {
    return this.dbClient;
  }
}

export default DataProvider;
