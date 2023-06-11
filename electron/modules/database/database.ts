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
  connect(): Promise<void>

  // close closes the database.
  close(): Promise<void>

  // all runs the given `sql` query with the optional
  // set of `params` and returns all the rows of the result.
  // A query may contain `?` and a positional param from `params`
  // will substitute the corresponding `?`.
  all(sql: string, params?: Param[]): Promise<object[]>

  // all runs the given `sql` query with the optional set of `params`.
  // A query may contain `?` and a positional param from `params`
  // will substitute the corresponding `?`.
  run(sql: string, params?: Param[]): Promise<void>
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
