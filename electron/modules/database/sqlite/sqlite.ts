const sqlite3 = require('sqlite3');

import { open, Database as SqliteDatabase } from 'sqlite';

import { Database, Param } from '../database';
import { ErrUndefinedResult } from '../errors';
import DatabaseBase from '../base/base';

export class Sqlite extends DatabaseBase implements Database {
  #client?: SqliteDatabase;
  #filename: string;

  // constructor constructs `Sqlite`.
  // The passed `filename` can be set to `":memory:"`
  // for an in-memory database.
  constructor(filename: string | ':memory:') {
    super();
    this.#filename = filename;
  }

  async #init(): Promise<void> {
    if (this.#client != undefined) {
      return;
    }

    const client = await open({
      filename: this.#filename,
      driver: sqlite3.Database
    });

    this.#client = client;
  }

  async close(): Promise<void> {
    await this.#init();

    this.#client?.close();
  }

  async all(sql: string, params?: Param[]): Promise<object[]> {
    await this.#init();
    const result = await this.#client?.all(sql, params);

    if (result == undefined) {
      throw ErrUndefinedResult; 
    }

    return result;
  }

  async run(sql: string, params?: Param[]): Promise<void> {
    await this.#init();
    await this.#client?.run(sql, params);
  }
}
