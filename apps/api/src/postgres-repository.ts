import pg from 'pg';
import { cachedRepository, type ContentRepository } from '@quran-grammar/core';
import {
  DATABASE_SCHEMA_VERSION,
  createSqlRepository,
  readContentVersion,
  type ContentVersion,
  type SqlExecutor,
} from '@quran-grammar/core/db';

/** The part of pg.Pool the repository uses (lets tests substitute a fake). */
export interface Queryable {
  query(sql: string, params: unknown[]): Promise<{ rows: Record<string, unknown>[] }>;
}

export function postgresExecutor(pool: Queryable): SqlExecutor {
  return {
    async all(sql, params) {
      return (await pool.query(sql, [...params])).rows;
    },
  };
}

/** Cached, read-only repository over the `quran_grammar` schema (content is static per sync). */
export function createPostgresRepository(pool: Queryable): ContentRepository {
  return cachedRepository(createSqlRepository(postgresExecutor(pool), 'postgres'));
}

/** Throws unless the database holds a complete schema-v2 copy. */
export async function checkPostgresContent(pool: Queryable): Promise<ContentVersion> {
  const version = await readContentVersion(postgresExecutor(pool), 'postgres');
  if (!version) throw new Error('quran_grammar.content_version is empty; run npm run db:sync');
  if (version.database_schema_version !== DATABASE_SCHEMA_VERSION)
    throw new Error(
      `quran_grammar schema version ${version.database_schema_version} ≠ ${DATABASE_SCHEMA_VERSION}; run npm run db:sync`,
    );
  return version;
}

/**
 * A small pool for a read-only role. Every session is read-only and statements are time-limited,
 * so a slow or hostile request cannot hold the shared Supabase database.
 */
export function createPostgresPool(connectionString: string): pg.Pool {
  const pool = new pg.Pool({
    connectionString,
    max: 4,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    statement_timeout: 5_000,
    query_timeout: 10_000,
    application_name: 'quran-grammar-api',
    options: '-c default_transaction_read_only=on',
  });
  pool.on('error', (error) => console.error('Postgres pool error:', error.message));
  return pool;
}
