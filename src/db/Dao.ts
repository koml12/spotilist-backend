import Knex from "knex";
import { container } from "tsyringe";
import DataProvider from "./DataProvider";

abstract class Dao {
  abstract getTableName(): string;

  async findByCriteria(
    criteria: Record<string, unknown>
  ): Promise<Record<string, unknown>[]> {
    return await this.getDbClient().where(criteria);
  }

  dbClient = container.resolve(DataProvider).getDbClient()(this.getTableName());

  getDbClient(): Knex.QueryBuilder {
    return container.resolve(DataProvider).getDbClient()(this.getTableName());
  }
}

export default Dao;
