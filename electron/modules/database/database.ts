interface Options {
  filename: string,
}

// param is the type of the parameter passed to
// the sql query.
type param = string | number

interface Database {
  // connect connects to the database.
  connect(opts: Options): void

  // close closes the database.
  close(): void

  // run runs the given `sql` query with the optional
  // set of `params`.
  // A query may contain `?` and a positional param from `params`
  // will substitute the corresponding `?`.
  run(
    sql: string,
    params: param[],
    callback: (err: Error, row: unknown) => void,
  ): void
}
