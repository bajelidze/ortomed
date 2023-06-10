import { Sqlite } from './sqlite/sqlite';

// DatabaseType is a type of the `Database`
// interface implementation.
export enum DatabaseType {
  Sqlite,
}

// Param is the type of the parameter passed to
// the sql query.
export type Param = string | number

export interface DatabaseOptions {
  type?: DatabaseType,
  filename?: string,
}

export interface Database {
  // connect connects to the database.
  connect(): void

  // close closes the database.
  close(): void

  // serialize runs all the query runs within the callback
  // serially, preventing race conditions.
  serialize(callback: () => void): void

  // eachWithParams runs the given `sql` query with the optional
  // set of `params` and calls the `callback` for every row of result.
  // A query may contain `?` and a positional param from `params`
  // will substitute the corresponding `?`.
  eachWithParams(
    sql: string,
    params: Param[],
    fn: (err: Error, row: unknown) => void,
  ): void

  // each runs the given `sql` query with the
  // `callback` called for every row of result.
  each(
    sql: string,
    fn: (err: Error, row: unknown) => void,
  ): void

  // run runs the given `sql` query.
  run(sql: string, fn: (err: Error) => void): void
}

// newDatabase returns a new database depending on the
// selected type. If no database type was specified,
// returns the `sqlite` database by default.
export function newDatabase(opts: DatabaseOptions): Database {
  if (opts.type == undefined) {
    opts.type = DatabaseType.Sqlite;
  }

  switch(opts.type) {
  case DatabaseType.Sqlite:
    if (opts.filename == undefined) {
      throw Error('filename not specified');
    }

    return new Sqlite(opts.filename);
  }
}
