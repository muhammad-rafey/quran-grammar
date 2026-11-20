/**
 * `@quran-grammar/core/db`: pure TypeScript (no node: imports) schema, row mapping and SQL shared
 * by the SQLite builders (node:sqlite), the mobile app (expo-sqlite) and the API (Postgres).
 */
export {
  DATABASE_SCHEMA_VERSION,
  POSTGRES_SCHEMA,
  TABLES_CHILD_FIRST,
  createTableStatements,
} from './schema';
export type { Dialect } from './schema';
export { studiesToRows, rowsToStudies } from './rows';
export type { StudyRows } from './rows';
export {
  ORDER_BY,
  TABLES_PARENT_FIRST,
  contentToRows,
  grammarToRows,
  rowsToContent,
  rowsToGrammar,
  rowsToQuestions,
  topicRowToRecord,
} from './grammar-rows';
export type { ContentRows, GrammarRows } from './grammar-rows';
export type { ContentVersion } from './version';
export { contentQueries, createSqlRepository, readContentVersion } from './sql-repository';
export type { SqlExecutor, SqlValue } from './sql-repository';
