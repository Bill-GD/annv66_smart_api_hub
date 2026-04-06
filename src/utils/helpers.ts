import db from '../database/knex';

export function getDBClient() {
  return `${db.client.config.client}`;
}

export async function checkField(tableName: string, field: string) {
  // const result = await db('information_schema.columns')
  //   .where({
  //     table_schema: 'public',
  //     table_name: tableName,
  //     column_name: field,
  //   })
  //   .count('column_name')
  //   .first();
  // const count = +(result?.count ?? 0);
  // return count > 0;
  return db.schema.hasColumn(tableName, field);
}

export async function checkResource(tableName: string) {
  // const result = await db('information_schema.tables')
  //   .where({
  //     table_schema: 'public',
  //     table_name: tableName,
  //   })
  //   .count('table_name')
  //   .first();
  // const count = +(result?.count ?? 0);
  // return count > 0;
  return db.schema.hasTable(tableName);
}
