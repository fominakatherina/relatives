const util = require("util");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db");

db.all = util.promisify(db.all);
db.run = util.promisify(db.run);

async function usersSelect(tableName) {
  const users = await db.all(
    `SELECT ${tableName}.id, ${tableName}.relation, relatives.slug, relatives.description FROM ${tableName} JOIN relatives ON ${tableName}.relation = relatives.id`
  );
  return users;
}

async function getTables() {
  const tables = await db.all(
    "SELECT name FROM sqlite_master WHERE type='table'"
  );
  return tables
    .filter(
      (table) => table.name !== "sqlite_sequence" && table.name !== "relatives"
    )
    .map((table) => table.name);
}

async function usersInsert(tableName, user) {
  if (user.relation) {
    await db.run(
      `INSERT INTO ${tableName} 
        (first_name, last_name, relation, vk_id) 
      VALUES 
        ('${user.first_name}', '${user.last_name}', '${user.relation}', '${user.id}')`
    );
  } else {
    await db.run(
      `INSERT INTO ${tableName} 
        (first_name, last_name, vk_id) 
      VALUES 
        ('${user.first_name}', '${user.last_name}', '${user.id}')`
    );
  }
}

async function createTable(tableName) {
  await db.run(`CREATE TABLE IF NOT EXISTS "${tableName}" (
    "id"	INTEGER,
    "first_name"	TEXT,
    "last_name"	TEXT,
    "relation"	TEXT,
    "vk_id"	INTEGER,
    PRIMARY KEY("id" AUTOINCREMENT)
  );`);
}

async function cutTable(tableName, offset) {
  await db.run(`DELETE FROM ${tableName} WHERE id > ${offset}`);
}

async function dropTable(tableName) {
  await db.run(`DROP TABLE IF EXISTS ${tableName}`);
}

module.exports = {
  usersSelect,
  usersInsert,
  createTable,
  getTables,
  dropTable,
  cutTable,
};
