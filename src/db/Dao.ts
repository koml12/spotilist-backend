import Knex from "knex";
import { container } from "tsyringe";
import DataProvider from "./DataProvider";

abstract class Dao<T> {
  abstract getTableName(): string;

  async findByCriteria(criteria: Record<string, unknown>): Promise<T[]> {
    return await this.getDbClient().where(criteria);
  }

  dbClient = container.resolve(DataProvider).getDbClient()(this.getTableName());

  getDbClient(): Knex.QueryBuilder {
    return container.resolve(DataProvider).getDbClient()(this.getTableName());
  }
}

export default Dao;
