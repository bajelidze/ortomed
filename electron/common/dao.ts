import { Knex } from 'knex';
import log from '@/common/logger';
import errs from '@/common/errors';

interface Class {
  id?: number;
}

export abstract class BasicDao<Cls extends Class, Entity> {
  protected db: Knex;
  protected initialized = false;

  readonly table: string;

  constructor(db: Knex, tableName: string) {
    this.db = db;
    this.table = tableName;
  }

  protected abstract createTable(): Promise<void>

  protected abstract toEntities(...classes: Cls[]): Entity[]

  protected abstract toClasses(...entities: Entity[]): Cls[]

  protected async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (!await this.db.schema.hasTable(this.table)) {
      this.createTable();

      log.info(`Created table "${this.table}"`);
    }

    this.initialized = true;
  }

  protected async list(
    builder?: (query: Knex.QueryBuilder) => Knex.QueryBuilder,
  ): Promise<Cls[]> {
    await this.init();

    let query = this.db
      .select('*')
      .from(this.table);

    if (builder) {
      query = builder(query);
    }

    const entities: Entity[] = await query;

    log.info(`Listed ${entities.length} ${this.table}`);

    return this.toClasses(...entities);
  }

  async listAll(): Promise<Cls[]> {
    return await this.list();
  }

  async listPages(limit: number, offset: number): Promise<Cls[]> {
    return await this.list(query => query.limit(limit).offset(offset));
  }

  async getById(id: number): Promise<Cls> {
    const classes = await this.list(query => query.where('id', id));

    if (classes.length == 0) {
      throw new errs.ErrNotFound(`item with id ${id} not found in ${this.table}`);
    }

    log.info(`Got item with id ${id} from "${this.table}"`);
    return classes[0];
  }

  async listByIds(...ids: number[]): Promise<Cls[]> {
    const classes = await this.list(query => query.whereIn('id', ids));

    if (classes.length == 0) {
      throw new errs.ErrNotFound(`no items with id in ${ids} found in ${this.table}`);
    }

    log.info(`Got ${classes.length} item${classes.length > 1 ? 's' : ''} with id in ${ids} from "${this.table}"`);
    return classes;
  }

  async add(...classes: Cls[]): Promise<number[]> {
    if (classes.length == 0) {
      throw Error('no items specified');
    }

    await this.init();

    const toInsert = classes.filter(cls => cls.id == undefined);
    const toUpdate = classes.filter(cls => cls.id != undefined);

    const ids: number[] = [];

    if (toInsert.length > 0) {
      const result: number[] = await this.db(this.table)
        .insert(this.toEntities(...classes));

      ids.push(...result);

      log.info(`Inserted ${toInsert.length} item${toInsert.length > 1 ? 's' : ''} into "${this.table}"`);
    }

    if (toUpdate.length > 0) {
      type resultT = {
        id: number;
      }

      for (const upd of toUpdate) {
        const result: resultT[] = await this.db(this.table)
          .where({ id: upd.id })
          .update(this.toEntities(upd)[0], ['id']);
        ids.push(result[0].id);
      }

      log.info(`Updated ${toUpdate.length} item${toUpdate.length > 1 ? 's' : ''} in "${this.table}"`);
    }

    return ids;
  }

  async deleteById(id: number): Promise<void> {
    await this.init();
    await this.db.from(this.table).where('id', id).del();

    log.info(`Deleted item with id ${id} from ${this.table}`);
  }
}
