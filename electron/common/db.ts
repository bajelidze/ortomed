import { Knex, knex } from 'knex';

const knexCfg: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: 'test.db',
  },
  useNullAsDefault: true,
};

export const db = knex(knexCfg);
export default db;
