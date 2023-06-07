// const Database = require('better-sqlite3');

// function fn() {
//   const db = new Database('foobar.db');
//   const result = db.pragma('journal_mode = WAL');

//   console.log(result);
//   console.log('xdd');
// }

// export default fn;
const sqlite3 = require('sqlite3');
// import sqlite3 from 'sqlite3';

function fn() {
  const db = new sqlite3.Database(':memory:');

  db.serialize(() => {
    db.run('CREATE TABLE lorem (info TEXT)');


    const stmt = db.prepare('INSERT INTO lorem VALUES (?)');
    for (let i = 0; i < 10; i++) {
      stmt.run('Ipsum ' + i);
    }
    stmt.finalize();

    db.each('SELECT rowid AS id, info FROM lorem', (_: any, row: any) => {
      console.log(row);
    });
  });

  db.close();
}

export default fn;
