// Database is a dummy base class providing
// implementation for the Database interface.
class Database {
  connect(): void { return; }

  close(): void { return; }

  serialize(callback: () => void): void {
    callback();
  }
}

export default Database;
