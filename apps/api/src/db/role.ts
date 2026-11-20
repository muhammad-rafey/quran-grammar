import { POSTGRES_SCHEMA } from '@quran-grammar/core/db';

/** Read-only role for the API. The password comes from the psql variable :reader_password. */
export function postgresRoleSql(): string {
  const s = POSTGRES_SCHEMA;
  return `-- Run once as postgres, e.g.: psql -v reader_password='…' -f role.sql
do $$ begin
  if not exists (select from pg_roles where rolname = 'quran_grammar_reader') then
    create role quran_grammar_reader login;
  end if;
end $$;
alter role quran_grammar_reader with login password :'reader_password';
alter role quran_grammar_reader set default_transaction_read_only = on;
alter role quran_grammar_reader set statement_timeout = '5s';
grant usage on schema ${s} to quran_grammar_reader;
grant select on all tables in schema ${s} to quran_grammar_reader;
alter default privileges in schema ${s} grant select on tables to quran_grammar_reader;
`;
}
