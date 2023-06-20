import { Knex } from 'knex';
import log from '@/common/logger';
import errs from '@/common/errors';

export abstract class BasicDao<Class, Entity> {
  protected db: Knex;
  protected initialized = false;

  readonly table: string;

  constructor(db: Knex, tableName: string) {
    this.db = db;
    this.table = tableName;
  }

  protected abstract createTable(): Promise<void>

  protected abstract toEntities(...classes: Class[]): Entity[]

  protected abstract toClasses(...activities: Entity[]): Class[]

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
  ): Promise<Class[]> {
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

  async listAll(): Promise<Class[]> {
    return this.list();
  }

  async listPages(limit: number, offset: number): Promise<Class[]> {
    return this.list(query => query.limit(limit).offset(offset));
  }

  async getById(id: number): Promise<Class> {
    const classes = await this.list(query => query.where('id', id));

    if (classes.length == 0) {
      throw new errs.ErrNotFound(`item with id ${id} not found in ${this.table}`);
    }

    log.info(`Got item with id ${id} from "${this.table}"`);
    return classes[0];
  }

  async add(...classes: Class[]): Promise<number[]> {
    if (classes.length == 0) {
      throw Error('no items specified');
    }

    await this.init();

    const result: number[] = await this.db
      .insert(this.toEntities(...classes))
      .into(this.table);

    log.info(`Added ${classes.length} items into "${this.table}"`);
    return result;
  }
}
