begin;

create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.event_status as enum (
  'draft', 'scheduled', 'live', 'completed', 'archived'
);

create type public.event_channel_type as enum (
  'primary', 'fallback', 'youtube', 'facebook', 'tiktok', 'instagram', 'other'
);

create type public.app_role as enum (
  'director', 'coordinator', 'academic', 'moderator', 'technical_admin'
);

create type public.question_internal_status as enum (
  'received', 'resolving', 'preliminary_review', 'validating', 'confirmed', 'corrected'
);

create type public.answer_public_status as enum (
  'preliminary', 'confirmed', 'corrected'
);

create type public.chat_moderation_status as enum (
  'visible', 'hidden', 'deleted'
);

create type public.asset_status as enum (
  'draft', 'published', 'archived'
);

create type public.lead_intent_type as enum (
  'registration', 'orientation', 'download', 'plan', 'other'
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug citext not null unique,
  university_name text not null,
  university_code text,
  city text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status public.event_status not null default 'draft',
  primary_stream_url text,
  fallback_stream_url text,
  results_url text,
  cta_label text,
  cta_url text,
  contingency_enabled boolean not null default false,
  contingency_message text,
  chat_enabled boolean not null default true,
  reactions_enabled boolean not null default true,
  configuration jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_slug_format check (slug::text ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint events_date_order check (ends_at is null or ends_at > starts_at)
);

create table public.event_channels (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  channel_type public.event_channel_type not null,
  label text not null,
  url text not null,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, channel_type, url)
);

create table public.areas (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  code text not null,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, code)
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  area_id uuid references public.areas(id) on delete set null,
  code text not null,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, code)
);

create table public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  whatsapp_normalized text not null unique,
  whatsapp_display text not null,
  consent_whatsapp boolean not null,
  consent_at timestamptz not null,
  consent_version text not null default 'p0-v1',
  source text,
  campaign text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_profiles_name_length check (char_length(trim(full_name)) between 2 and 120),
  constraint user_profiles_whatsapp_format check (whatsapp_normalized ~ '^\\+[1-9][0-9]{7,14}$'),
  constraint user_profiles_consent_required check (consent_whatsapp = true)
);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid not null references public.user_profiles(id) on delete cascade,
  university text,
  career text,
  discovery_source text,
  unlocked_stage smallint not null default 1,
  session_token_hash text unique,
  registered_at timestamptz not null default now(),
  completed_at timestamptz,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, profile_id),
  constraint event_registrations_stage check (unlocked_stage between 1 and 2)
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  role public.app_role not null,
  can_validate boolean not null default false,
  granted_by uuid references auth.users(id) on delete set null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  notes text
);

create unique index user_roles_active_scope_unique
  on public.user_roles (user_id, coalesce(event_id, '00000000-0000-0000-0000-000000000000'::uuid), role)
  where revoked_at is null;

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  area_id uuid references public.areas(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  question_number integer not null,
  prompt_text text not null,
  prompt_image_path text,
  alternatives jsonb not null default '[]'::jsonb,
  internal_status public.question_internal_status not null default 'received',
  assigned_to uuid references auth.users(id) on delete set null,
  current_version integer not null default 0,
  received_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, question_number),
  constraint questions_number_positive check (question_number > 0),
  constraint questions_prompt_present check (char_length(trim(prompt_text)) > 0),
  constraint questions_alternatives_array check (jsonb_typeof(alternatives) = 'array')
);

create table public.question_versions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  version_no integer not null,
  preliminary_answer text,
  confirmed_answer text,
  explanation text,
  internal_status public.question_internal_status not null,
  responsible_user_id uuid references auth.users(id) on delete set null,
  validator_user_id uuid references auth.users(id) on delete set null,
  change_reason text,
  parent_version_id uuid references public.question_versions(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique (question_id, version_no),
  constraint question_versions_number_positive check (version_no > 0),
  constraint question_versions_answer_present check (
    preliminary_answer is not null or confirmed_answer is not null
  )
);

-- This is the only academic table exposed to the public Realtime channel.
-- It intentionally excludes staff UUIDs, draft notes and validation history.
create table public.question_publications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  question_version_id uuid not null references public.question_versions(id) on delete restrict,
  area_id uuid references public.areas(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  question_number integer not null,
  prompt_text text not null,
  prompt_image_path text,
  alternatives jsonb not null default '[]'::jsonb,
  public_status public.answer_public_status not null,
  answer text not null,
  explanation text,
  version_no integer not null,
  corrected_from_publication_id uuid references public.question_publications(id) on delete set null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (question_version_id),
  constraint question_publications_answer_present check (char_length(trim(answer)) > 0),
  constraint question_publications_version_positive check (version_no > 0),
  constraint question_publications_alternatives_array check (jsonb_typeof(alternatives) = 'array'),
  constraint question_publications_correction_parent check (
    public_status <> 'corrected' or corrected_from_publication_id is not null
  )
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid not null references public.user_profiles(id) on delete cascade,
  display_name text not null,
  message_body text not null,
  moderation_status public.chat_moderation_status not null default 'visible',
  is_pinned boolean not null default false,
  moderated_by uuid references auth.users(id) on delete set null,
  moderation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint chat_messages_body_length check (char_length(trim(message_body)) between 1 and 500),
  constraint chat_messages_display_name_length check (char_length(trim(display_name)) between 2 and 80)
);

create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid not null references public.user_profiles(id) on delete cascade,
  reaction_type text not null,
  context_key text not null default 'live',
  created_at timestamptz not null default now(),
  constraint reactions_allowed_type check (reaction_type in ('like', 'heart', 'laugh', 'wow', 'clap', 'fire'))
);

create table public.chat_restrictions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid not null references public.user_profiles(id) on delete cascade,
  restriction_type text not null,
  reason text,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint chat_restrictions_type check (restriction_type in ('mute', 'block')),
  constraint chat_restrictions_date_order check (ends_at is null or ends_at > starts_at)
);

create unique index chat_restrictions_active_unique
  on public.chat_restrictions (event_id, profile_id, restriction_type)
  where revoked_at is null;

create table public.download_assets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  description text,
  asset_type text not null,
  storage_path text not null,
  mime_type text,
  file_size_bytes bigint,
  status public.asset_status not null default 'draft',
  requires_registration boolean not null default true,
  registration_stage_required smallint not null default 1,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint download_assets_stage check (registration_stage_required between 1 and 2),
  constraint download_assets_size check (file_size_bytes is null or file_size_bytes >= 0)
);

create table public.asset_downloads (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  asset_id uuid not null references public.download_assets(id) on delete cascade,
  profile_id uuid not null references public.user_profiles(id) on delete cascade,
  registration_id uuid references public.event_registrations(id) on delete set null,
  source text,
  campaign text,
  downloaded_at timestamptz not null default now()
);

create table public.lead_intents (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid not null references public.user_profiles(id) on delete cascade,
  registration_id uuid references public.event_registrations(id) on delete set null,
  intent_type public.lead_intent_type not null,
  source text,
  campaign text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.analytics_events (
  id bigint generated always as identity primary key,
  event_id uuid references public.events(id) on delete cascade,
  profile_id uuid references public.user_profiles(id) on delete set null,
  registration_id uuid references public.event_registrations(id) on delete set null,
  session_id uuid,
  event_name text not null,
  source text,
  campaign text,
  path text,
  properties jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  code citext not null unique,
  name text not null,
  description text,
  price_amount numeric(10,2),
  currency char(3) not null default 'PEN',
  billing_period text,
  benefits jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plans_price_nonnegative check (price_amount is null or price_amount >= 0)
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.user_profiles(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete restrict,
  event_id uuid references public.events(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'active',
  source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entitlements_date_order check (ends_at is null or ends_at > starts_at),
  constraint entitlements_status check (status in ('pending', 'active', 'expired', 'cancelled'))
);

create table public.trials (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.user_profiles(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  plan_id uuid not null references public.plans(id) on delete restrict,
  trial_code citext not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  activated_at timestamptz,
  status text not null default 'eligible',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, trial_code),
  constraint trials_date_order check (ends_at > starts_at),
  constraint trials_status check (status in ('eligible', 'active', 'used', 'expired', 'revoked'))
);

create table public.promotion_eligibilities (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.user_profiles(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  promotion_code citext not null,
  is_eligible boolean not null default false,
  reason text,
  evaluated_at timestamptz not null default now(),
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  unique (profile_id, event_id, promotion_code)
);

-- Future services architecture only. No checkout or hardcoded price is enabled in P0.
create table public.services (
  id uuid primary key default gen_random_uuid(),
  code citext not null unique,
  name text not null,
  description text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_modalities (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  code citext not null,
  name text not null,
  description text,
  is_active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (service_id, code)
);

create table public.service_levels (
  id uuid primary key default gen_random_uuid(),
  modality_id uuid not null references public.service_modalities(id) on delete cascade,
  code citext not null,
  name text not null,
  description text,
  is_active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (modality_id, code)
);

create table public.service_packages (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references public.service_levels(id) on delete cascade,
  code citext not null unique,
  name text not null,
  description text,
  session_count integer,
  price_amount numeric(10,2),
  currency char(3) not null default 'PEN',
  is_active boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_packages_sessions_positive check (session_count is null or session_count > 0),
  constraint service_packages_price_nonnegative check (price_amount is null or price_amount >= 0)
);

create table public.service_orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.user_profiles(id) on delete restrict,
  event_id uuid references public.events(id) on delete set null,
  package_id uuid not null references public.service_packages(id) on delete restrict,
  status text not null default 'created',
  payment_provider text,
  external_payment_reference text,
  paid_at timestamptz,
  scheduled_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_orders_status check (
    status in ('created', 'pending_payment', 'paid', 'scheduled', 'cancelled', 'refunded')
  )
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  event_id uuid references public.events(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  table_name text not null,
  action text not null,
  target_id text,
  before_data jsonb,
  after_data jsonb,
  occurred_at timestamptz not null default now()
);

create index events_status_starts_idx on public.events (status, starts_at);
create index event_channels_event_active_idx on public.event_channels (event_id, is_active, sort_order);
create index areas_event_sort_idx on public.areas (event_id, sort_order);
create index courses_event_area_sort_idx on public.courses (event_id, area_id, sort_order);
create index registrations_event_profile_idx on public.event_registrations (event_id, profile_id);
create index questions_event_status_idx on public.questions (event_id, internal_status, question_number);
create index question_versions_question_idx on public.question_versions (question_id, version_no desc);
create index publications_event_status_idx on public.question_publications (event_id, public_status, question_number);
create index chat_event_created_idx on public.chat_messages (event_id, created_at desc);
create index reactions_event_created_idx on public.reactions (event_id, created_at desc);
create index chat_restrictions_event_profile_idx on public.chat_restrictions (event_id, profile_id);
create index downloads_event_profile_idx on public.asset_downloads (event_id, profile_id, downloaded_at desc);
create index lead_intents_event_type_idx on public.lead_intents (event_id, intent_type, created_at desc);
create index analytics_event_name_idx on public.analytics_events (event_id, event_name, occurred_at desc);
create index audit_event_time_idx on public.audit_logs (event_id, occurred_at desc);
create index service_orders_profile_status_idx on public.service_orders (profile_id, status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.has_event_role(
  target_event_id uuid,
  allowed_roles public.app_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.revoked_at is null
      and ur.role = any(allowed_roles)
      and (ur.event_id is null or target_event_id is null or ur.event_id = target_event_id)
  );
$$;

create or replace function public.can_validate_event(target_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.revoked_at is null
      and (ur.event_id is null or target_event_id is null or ur.event_id = target_event_id)
      and (
        ur.role in ('director', 'coordinator')
        or (ur.role = 'academic' and ur.can_validate = true)
      )
  );
$$;

create or replace function public.safe_uuid(value text)
returns uuid
language plpgsql
immutable
set search_path = public, pg_temp
as $$
begin
  return value::uuid;
exception when others then
  return null;
end;
$$;

create or replace function public.prevent_published_version_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if old.published_at is not null
    or old.internal_status in ('validating', 'confirmed', 'corrected') then
    raise exception 'Published academic versions are immutable; create a correction version.';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create or replace function public.validate_question_publication()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  source_question public.questions%rowtype;
  source_version public.question_versions%rowtype;
begin
  select * into source_question
  from public.questions
  where id = new.question_id;

  select * into source_version
  from public.question_versions
  where id = new.question_version_id
    and question_id = new.question_id;

  if source_question.id is null or source_version.id is null then
    raise exception 'Publication source question/version is invalid.';
  end if;

  if new.event_id <> source_question.event_id
    or new.question_number <> source_question.question_number
    or new.version_no <> source_version.version_no
    or new.prompt_text <> source_question.prompt_text
    or new.alternatives <> source_question.alternatives then
    raise exception 'Published snapshot must match its source question and version.';
  end if;

  if new.public_status = 'preliminary' then
    if source_version.internal_status not in ('preliminary_review', 'validating')
      or source_version.preliminary_answer is null
      or new.answer <> source_version.preliminary_answer then
      raise exception 'A preliminary publication requires a matching preliminary version.';
    end if;
  else
    if source_version.internal_status::text <> new.public_status::text
      or source_version.validator_user_id is null
      or source_version.confirmed_answer is null
      or new.answer <> source_version.confirmed_answer then
      raise exception 'Confirmed/corrected publications require a matching human-validated version.';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.prevent_publication_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  raise exception 'Published answers are immutable; insert a corrected publication instead.';
  return old;
end;
$$;

create or replace function public.write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  old_data jsonb;
  new_data jsonb;
  audit_event_id uuid;
  audit_target_id text;
begin
  old_data := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end;
  new_data := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end;
  audit_event_id := public.safe_uuid(coalesce(new_data ->> 'event_id', old_data ->> 'event_id'));
  audit_target_id := coalesce(new_data ->> 'id', old_data ->> 'id');

  insert into public.audit_logs (
    event_id, actor_user_id, table_name, action, target_id, before_data, after_data
  ) values (
    audit_event_id, auth.uid(), tg_table_name, tg_op, audit_target_id, old_data, new_data
  );

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create trigger events_set_updated_at before update on public.events
for each row execute function public.set_updated_at();
create trigger event_channels_set_updated_at before update on public.event_channels
for each row execute function public.set_updated_at();
create trigger areas_set_updated_at before update on public.areas
for each row execute function public.set_updated_at();
create trigger courses_set_updated_at before update on public.courses
for each row execute function public.set_updated_at();
create trigger user_profiles_set_updated_at before update on public.user_profiles
for each row execute function public.set_updated_at();
create trigger event_registrations_set_updated_at before update on public.event_registrations
for each row execute function public.set_updated_at();
create trigger questions_set_updated_at before update on public.questions
for each row execute function public.set_updated_at();
create trigger chat_messages_set_updated_at before update on public.chat_messages
for each row execute function public.set_updated_at();
create trigger download_assets_set_updated_at before update on public.download_assets
for each row execute function public.set_updated_at();
create trigger plans_set_updated_at before update on public.plans
for each row execute function public.set_updated_at();
create trigger entitlements_set_updated_at before update on public.entitlements
for each row execute function public.set_updated_at();
create trigger trials_set_updated_at before update on public.trials
for each row execute function public.set_updated_at();
create trigger services_set_updated_at before update on public.services
for each row execute function public.set_updated_at();
create trigger service_modalities_set_updated_at before update on public.service_modalities
for each row execute function public.set_updated_at();
create trigger service_levels_set_updated_at before update on public.service_levels
for each row execute function public.set_updated_at();
create trigger service_packages_set_updated_at before update on public.service_packages
for each row execute function public.set_updated_at();
create trigger service_orders_set_updated_at before update on public.service_orders
for each row execute function public.set_updated_at();

create trigger question_versions_immutable
before update or delete on public.question_versions
for each row execute function public.prevent_published_version_mutation();

create trigger question_publications_validate
before insert on public.question_publications
for each row execute function public.validate_question_publication();

create trigger question_publications_immutable
before update or delete on public.question_publications
for each row execute function public.prevent_publication_mutation();

create trigger events_audit after insert or update or delete on public.events
for each row execute function public.write_audit_log();
create trigger user_roles_audit after insert or update or delete on public.user_roles
for each row execute function public.write_audit_log();
create trigger questions_audit after insert or update or delete on public.questions
for each row execute function public.write_audit_log();
create trigger question_versions_audit after insert or update or delete on public.question_versions
for each row execute function public.write_audit_log();
create trigger question_publications_audit after insert or update or delete on public.question_publications
for each row execute function public.write_audit_log();
create trigger download_assets_audit after insert or update or delete on public.download_assets
for each row execute function public.write_audit_log();

alter table public.events enable row level security;
alter table public.event_channels enable row level security;
alter table public.areas enable row level security;
alter table public.courses enable row level security;
alter table public.user_profiles enable row level security;
alter table public.event_registrations enable row level security;
alter table public.user_roles enable row level security;
alter table public.questions enable row level security;
alter table public.question_versions enable row level security;
alter table public.question_publications enable row level security;
alter table public.chat_messages enable row level security;
alter table public.reactions enable row level security;
alter table public.chat_restrictions enable row level security;
alter table public.download_assets enable row level security;
alter table public.asset_downloads enable row level security;
alter table public.lead_intents enable row level security;
alter table public.analytics_events enable row level security;
alter table public.plans enable row level security;
alter table public.entitlements enable row level security;
alter table public.trials enable row level security;
alter table public.promotion_eligibilities enable row level security;
alter table public.services enable row level security;
alter table public.service_modalities enable row level security;
alter table public.service_levels enable row level security;
alter table public.service_packages enable row level security;
alter table public.service_orders enable row level security;
alter table public.audit_logs enable row level security;

create policy events_public_read on public.events
for select to anon, authenticated
using (status in ('scheduled', 'live', 'completed'));

create policy events_staff_read on public.events
for select to authenticated
using (public.has_event_role(id, array['director', 'coordinator', 'academic', 'moderator', 'technical_admin']::public.app_role[]));

create policy events_staff_insert on public.events
for insert to authenticated
with check (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]));

create policy events_staff_update on public.events
for update to authenticated
using (public.has_event_role(id, array['director', 'coordinator', 'technical_admin']::public.app_role[]))
with check (public.has_event_role(id, array['director', 'coordinator', 'technical_admin']::public.app_role[]));

create policy events_director_delete on public.events
for delete to authenticated
using (public.has_event_role(id, array['director']::public.app_role[]));

create policy channels_public_read on public.event_channels
for select to anon, authenticated
using (
  is_active and exists (
    select 1 from public.events e
    where e.id = event_id and e.status in ('scheduled', 'live', 'completed')
  )
);

create policy channels_staff_manage on public.event_channels
for all to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'technical_admin']::public.app_role[]))
with check (public.has_event_role(event_id, array['director', 'coordinator', 'technical_admin']::public.app_role[]));

create policy areas_public_read on public.areas
for select to anon, authenticated
using (
  is_active and exists (
    select 1 from public.events e
    where e.id = event_id and e.status in ('scheduled', 'live', 'completed')
  )
);

create policy areas_staff_manage on public.areas
for all to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'academic']::public.app_role[]))
with check (public.has_event_role(event_id, array['director', 'coordinator', 'academic']::public.app_role[]));

create policy courses_public_read on public.courses
for select to anon, authenticated
using (
  is_active and exists (
    select 1 from public.events e
    where e.id = event_id and e.status in ('scheduled', 'live', 'completed')
  )
);

create policy courses_staff_manage on public.courses
for all to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'academic']::public.app_role[]))
with check (public.has_event_role(event_id, array['director', 'coordinator', 'academic']::public.app_role[]));

create policy profiles_staff_read on public.user_profiles
for select to authenticated
using (public.has_event_role(null, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy profiles_staff_update on public.user_profiles
for update to authenticated
using (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]))
with check (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]));

create policy registrations_staff_read on public.event_registrations
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy registrations_staff_update on public.event_registrations
for update to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator']::public.app_role[]))
with check (public.has_event_role(event_id, array['director', 'coordinator']::public.app_role[]));

create policy roles_self_read on public.user_roles
for select to authenticated
using (user_id = auth.uid());

create policy roles_director_read on public.user_roles
for select to authenticated
using (public.has_event_role(event_id, array['director']::public.app_role[]));

create policy roles_director_insert on public.user_roles
for insert to authenticated
with check (public.has_event_role(event_id, array['director']::public.app_role[]));

create policy roles_director_update on public.user_roles
for update to authenticated
using (public.has_event_role(event_id, array['director']::public.app_role[]))
with check (public.has_event_role(event_id, array['director']::public.app_role[]));

create policy questions_staff_read on public.questions
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'academic']::public.app_role[]));

create policy questions_academic_insert on public.questions
for insert to authenticated
with check (public.has_event_role(event_id, array['director', 'coordinator', 'academic']::public.app_role[]));

create policy questions_academic_update on public.questions
for update to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'academic']::public.app_role[]))
with check (public.has_event_role(event_id, array['director', 'coordinator', 'academic']::public.app_role[]));

create policy questions_lead_delete on public.questions
for delete to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator']::public.app_role[]));

create policy versions_staff_read on public.question_versions
for select to authenticated
using (
  exists (
    select 1 from public.questions q
    where q.id = question_id
      and public.has_event_role(q.event_id, array['director', 'coordinator', 'academic']::public.app_role[])
  )
);

create policy versions_academic_insert on public.question_versions
for insert to authenticated
with check (
  internal_status in ('received', 'resolving', 'preliminary_review', 'validating')
  and validator_user_id is null
  and exists (
    select 1 from public.questions q
    where q.id = question_id
      and public.has_event_role(q.event_id, array['director', 'coordinator', 'academic']::public.app_role[])
  )
);

create policy versions_validated_insert on public.question_versions
for insert to authenticated
with check (
  internal_status in ('confirmed', 'corrected')
  and validator_user_id = auth.uid()
  and exists (
    select 1 from public.questions q
    where q.id = question_id
      and public.can_validate_event(q.event_id)
  )
);

create policy versions_academic_update_drafts on public.question_versions
for update to authenticated
using (
  published_at is null
  and internal_status in ('received', 'resolving', 'preliminary_review')
  and exists (
    select 1 from public.questions q
    where q.id = question_id
      and public.has_event_role(q.event_id, array['director', 'coordinator', 'academic']::public.app_role[])
  )
)
with check (
  published_at is null
  and exists (
    select 1 from public.questions q
    where q.id = question_id
      and public.has_event_role(q.event_id, array['director', 'coordinator', 'academic']::public.app_role[])
  )
);

create policy publications_public_read on public.question_publications
for select to anon, authenticated
using (
  exists (
    select 1 from public.events e
    where e.id = event_id and e.status in ('scheduled', 'live', 'completed')
  )
);

create policy publications_staff_read on public.question_publications
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'academic']::public.app_role[]));

create policy publications_preliminary_insert on public.question_publications
for insert to authenticated
with check (
  public_status = 'preliminary'
  and public.has_event_role(event_id, array['director', 'coordinator', 'academic']::public.app_role[])
);

create policy publications_validated_insert on public.question_publications
for insert to authenticated
with check (
  public_status in ('confirmed', 'corrected')
  and public.can_validate_event(event_id)
);

create policy chat_staff_read on public.chat_messages
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy chat_moderator_update on public.chat_messages
for update to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]))
with check (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy reactions_staff_read on public.reactions
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy chat_restrictions_staff_read on public.chat_restrictions
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy chat_restrictions_moderator_insert on public.chat_restrictions
for insert to authenticated
with check (
  created_by = auth.uid()
  and public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[])
);

create policy chat_restrictions_moderator_update on public.chat_restrictions
for update to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]))
with check (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy assets_public_metadata on public.download_assets
for select to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1 from public.events e
    where e.id = event_id and e.status in ('scheduled', 'live', 'completed')
  )
);

create policy assets_staff_manage on public.download_assets
for all to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]))
with check (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy downloads_staff_read on public.asset_downloads
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy leads_staff_read on public.lead_intents
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy analytics_staff_read on public.analytics_events
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'technical_admin']::public.app_role[]));

create policy plans_public_read on public.plans
for select to anon, authenticated
using (is_active);

create policy plans_director_manage on public.plans
for all to authenticated
using (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]))
with check (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]));

create policy entitlements_staff_read on public.entitlements
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy trials_staff_read on public.trials
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy promotions_staff_read on public.promotion_eligibilities
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy services_public_read on public.services
for select to anon, authenticated
using (is_active);

create policy service_modalities_public_read on public.service_modalities
for select to anon, authenticated
using (
  is_active and exists (
    select 1 from public.services s where s.id = service_id and s.is_active
  )
);

create policy service_levels_public_read on public.service_levels
for select to anon, authenticated
using (
  is_active and exists (
    select 1
    from public.service_modalities sm
    join public.services s on s.id = sm.service_id
    where sm.id = modality_id and sm.is_active and s.is_active
  )
);

create policy service_packages_public_read on public.service_packages
for select to anon, authenticated
using (
  is_active and exists (
    select 1
    from public.service_levels sl
    join public.service_modalities sm on sm.id = sl.modality_id
    join public.services s on s.id = sm.service_id
    where sl.id = level_id and sl.is_active and sm.is_active and s.is_active
  )
);

create policy services_director_manage on public.services
for all to authenticated
using (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]))
with check (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]));

create policy service_modalities_director_manage on public.service_modalities
for all to authenticated
using (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]))
with check (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]));

create policy service_levels_director_manage on public.service_levels
for all to authenticated
using (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]))
with check (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]));

create policy service_packages_director_manage on public.service_packages
for all to authenticated
using (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]))
with check (public.has_event_role(null, array['director', 'coordinator']::public.app_role[]));

create policy service_orders_staff_read on public.service_orders
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'moderator']::public.app_role[]));

create policy audit_staff_read on public.audit_logs
for select to authenticated
using (public.has_event_role(event_id, array['director', 'coordinator', 'technical_admin']::public.app_role[]));

revoke all on function public.has_event_role(uuid, public.app_role[]) from public;
revoke all on function public.can_validate_event(uuid) from public;
grant execute on function public.has_event_role(uuid, public.app_role[]) to authenticated;
grant execute on function public.can_validate_event(uuid) to authenticated;

-- Registration, chat, reactions, downloads and analytics are written later through
-- narrowly scoped server/RPC functions. Anonymous clients receive no direct write access.
revoke insert, update, delete on public.user_profiles from anon;
revoke insert, update, delete on public.event_registrations from anon;
revoke insert, update, delete on public.chat_messages from anon;
revoke insert, update, delete on public.reactions from anon;
revoke insert, update, delete on public.asset_downloads from anon;
revoke insert, update, delete on public.lead_intents from anon;
revoke insert, update, delete on public.analytics_events from anon;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pclass-assets',
  'pclass-assets',
  false,
  26214400,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy pclass_assets_staff_read on storage.objects
for select to authenticated
using (
  bucket_id = 'pclass-assets'
  and public.has_event_role(
    public.safe_uuid((storage.foldername(name))[1]),
    array['director', 'coordinator', 'academic', 'moderator', 'technical_admin']::public.app_role[]
  )
);

create policy pclass_assets_staff_insert on storage.objects
for insert to authenticated
with check (
  bucket_id = 'pclass-assets'
  and public.has_event_role(
    public.safe_uuid((storage.foldername(name))[1]),
    array['director', 'coordinator', 'academic', 'moderator']::public.app_role[]
  )
);

create policy pclass_assets_staff_update on storage.objects
for update to authenticated
using (
  bucket_id = 'pclass-assets'
  and public.has_event_role(
    public.safe_uuid((storage.foldername(name))[1]),
    array['director', 'coordinator', 'academic', 'moderator']::public.app_role[]
  )
)
with check (
  bucket_id = 'pclass-assets'
  and public.has_event_role(
    public.safe_uuid((storage.foldername(name))[1]),
    array['director', 'coordinator', 'academic', 'moderator']::public.app_role[]
  )
);

create policy pclass_assets_director_delete on storage.objects
for delete to authenticated
using (
  bucket_id = 'pclass-assets'
  and public.has_event_role(
    public.safe_uuid((storage.foldername(name))[1]),
    array['director', 'coordinator']::public.app_role[]
  )
);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'question_publications'
  ) then
    alter publication supabase_realtime add table public.question_publications;
  end if;
end $$;

commit;
