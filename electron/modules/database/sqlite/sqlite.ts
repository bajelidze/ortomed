const sqlite3 = require('sqlite3');

import { Database, Param } from '../database';
import DatabaseBase from '../base/base';

export class Sqlite extends DatabaseBase implements Database {
  #client: any;

  // constructor constructs `Sqlite`.
  // The passed `filename` can be set to `":memory:"`
  // for an in-memory database.
  constructor(filename: string) {
    super();

    this.#client = new sqlite3.Database(filename);
  }

  close(): void {
    this.#client.close();
  }

  serialize(fn: () => void): void {
    this.#client.serialize(fn);
  }

  eachWithParams(
    sql: string,
    params: Param[],
    fn: (err: Error, row: unknown) => void,
  ): void {
    this.#client.run(sql, params, fn);
  }

  each(sql: string, fn: (err: Error, row: any) => void): void {
    this.#client.each(sql, fn);
  }

  run(sql: string, fn: (err: Error) => void): void {
    this.#client.run(sql, null, fn);
  }
}
