import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../supabase/migrations/202608080001_pclass_p0_schema.sql",
  import.meta.url,
);

const requiredTables = [
  "events",
  "event_channels",
  "areas",
  "courses",
  "user_profiles",
  "event_registrations",
  "user_roles",
  "questions",
  "question_versions",
  "question_publications",
  "chat_messages",
  "reactions",
  "chat_restrictions",
  "download_assets",
  "asset_downloads",
  "lead_intents",
  "analytics_events",
  "plans",
  "entitlements",
  "trials",
  "promotion_eligibilities",
  "audit_logs",
  "services",
  "service_modalities",
  "service_levels",
  "service_packages",
  "service_orders",
];

test("defines every P0 and future-ready table with RLS", async () => {
  const sql = await readFile(migrationUrl, "utf8");

  for (const table of requiredTables) {
    assert.match(sql, new RegExp(`create table public\\.${table} \\(`), table);
    assert.match(
      sql,
      new RegExp(`alter table public\\.${table} enable row level security;`),
      `${table} RLS`,
    );
  }

  assert.equal((sql.match(/create table public\./g) ?? []).length, requiredTables.length);
  assert.equal((sql.match(/enable row level security;/g) ?? []).length, requiredTables.length);
});

test("keeps PII and academic validation data out of the public projection", async () => {
  const sql = await readFile(migrationUrl, "utf8");
  const publicationTable = sql.match(
    /create table public\.question_publications \(([\s\S]*?)\n\);/,
  )?.[1] ?? "";

  assert.match(publicationTable, /public_status public\.answer_public_status/);
  assert.match(publicationTable, /answer text not null/);
  assert.doesNotMatch(publicationTable, /responsible_user_id|validator_user_id|whatsapp/);
  assert.doesNotMatch(sql, /profiles_public|user_profiles[\s\S]{0,80}to anon/);
  assert.match(sql, /question_publications_immutable/);
  assert.match(sql, /human-validated version/);
});

test("defines five staff roles, validation capability and critical audit logs", async () => {
  const sql = await readFile(migrationUrl, "utf8");

  for (const role of ["director", "coordinator", "academic", "moderator", "technical_admin"]) {
    assert.match(sql, new RegExp(`'${role}'`));
  }

  assert.match(sql, /can_validate boolean not null default false/);
  assert.match(sql, /create or replace function public\.has_event_role/);
  assert.match(sql, /create or replace function public\.can_validate_event/);
  assert.match(sql, /create trigger question_publications_audit/);
  assert.match(sql, /create trigger events_audit/);
});

test("contains no seeded operators, passwords or Supabase secret values", async () => {
  const [sql, envExample] = await Promise.all([
    readFile(migrationUrl, "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(sql, /Edinson|Jhean|Kimberly|Kevin/i);
  assert.doesNotMatch(sql, /sb_secret_[A-Za-z0-9_-]+|service_role\s*=\s*eyJ/i);
  assert.doesNotMatch(envExample, /SUPABASE_(?:SECRET|SERVICE_ROLE)_KEY=\S+/);
  assert.doesNotMatch(sql, /is null\s+exists\s*\(/i);
});

