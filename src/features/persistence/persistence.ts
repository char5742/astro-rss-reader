import {DatabaseSync} from "node:sqlite";

const dbname = "mydb.sqlite";

{
  const db = new DatabaseSync(dbname);
  db.exec(`
       CREATE TABLE IF NOT EXISTS store (
        key TEXT PRIMARY KEY,
        value TEXT
      )`);
  console.log("Table created successfully");
}

// key, valueとしてsqliteにjsonを保存する
export function save(key: string, value: string): void {
  const db = new DatabaseSync(dbname);
  const statement = db.prepare(
    `insert or replace into store (key, value) values (?, ?);`,
  );
  statement.run(key, value);
}

export function load(key: string): string | undefined {
  const db = new DatabaseSync(dbname);
  const statement = db.prepare(`select value from store where key = ?;`);
  const result = statement.get(key) as unknown as { value: string } | undefined;
  return result?.value ?? undefined;
}
