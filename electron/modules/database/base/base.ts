// Database is a dummy base class providing
// implementation for the Database interface.
class Database {
  async connect(): Promise<void> { return; }

  async close(): Promise<void> { return; }
}

export default Database;
