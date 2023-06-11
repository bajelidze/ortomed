import { Database as Sqlite3Database } from 'sqlite3';
import { open, Database as SqliteDatabase } from 'sqlite';

import { Database, Param } from '@/modules/database/database';
import { ErrUndefinedResult } from '@/modules/database/errors';
import DatabaseBase from '@/modules/database/base/base';

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
      driver: Sqlite3Database,
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
