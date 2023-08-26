import { Knex } from 'knex';
import { BasicDao } from '@/common/dao';
import db from '@/common/db';
import { LocaleFile } from '../../../common/enums';

export const _settingsTable = 'settings';

export class Settings {
  id?: number;
  locale = LocaleFile.enUS;

  private initialized = false;
  private db?: Knex;
  private dao?: SettingsDao;

  constructor(init?: Partial<Settings>) {
    Object.assign(this, init);
    this.db = db;
  }

  private init() {
    if (this.initialized) {
      return;
    } else if (!this.db) {
      throw new Error('database was not set');
    }

    this.dao = new SettingsDao(this.db);
    this.initialized = true;
  }

  // setDb sets the database backend.
  setDb(db: Knex) {
    this.db = db;
    return this;
  }

  // commit adds the Course to the store.
  async commit() {
    this.init();

    const ids = await this.dao?.add(this);

    if (ids == undefined) {
      throw Error('ids is undefined');
    }

    this.id = ids[0];
    return this;
  }
}

export interface SettingsEntity {
  id?: number;
  locale?: string;
}

export class SettingsDao extends BasicDao<Settings, SettingsEntity> {
  constructor(db: Knex) {
    super(db, _settingsTable);
  }

  protected async createTable(): Promise<void> {
    return await this.db.schema.createTable(this.table, table => {
      table.increments('id');
      table.string('locale').notNullable();
    });
  }

  protected toEntities(...settings: Settings[]): SettingsEntity[] {
    return settings.map(setting => ({
      id: setting.id,
      locale: setting.locale,
    }));
  }

  protected toClasses(...settingsEntities: SettingsEntity[]): Settings[] {
    return settingsEntities.map(setting => (new Settings({
      id: setting.id,
      locale: setting.locale as LocaleFile,
    })));
  }
}
