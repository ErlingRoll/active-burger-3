-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.account (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  discord_id text UNIQUE,
  discord_avatar text,
  name text,
  admin boolean NOT NULL DEFAULT false,
  CONSTRAINT account_pkey PRIMARY KEY (id)
);
CREATE TABLE public.character (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  account_id uuid,
  name text,
  x bigint DEFAULT '0'::bigint,
  y bigint DEFAULT '0'::bigint,
  max_hp bigint NOT NULL DEFAULT '100'::bigint,
  current_hp bigint NOT NULL DEFAULT '100'::bigint,
  direction text NOT NULL DEFAULT 'right'::text,
  name_visible boolean NOT NULL DEFAULT false,
  CONSTRAINT character_pkey PRIMARY KEY (id),
  CONSTRAINT character_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(id)
);
CREATE TABLE public.entity (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  x bigint NOT NULL,
  y bigint NOT NULL,
  texture text,
  height bigint,
  width bigint,
  solid boolean NOT NULL DEFAULT false,
  name_visible boolean NOT NULL DEFAULT false,
  type text DEFAULT 'object'::text,
  object_id text,
  max_hp bigint DEFAULT 100,
  current_hp bigint DEFAULT 100,
  CONSTRAINT entity_pkey PRIMARY KEY (id)
);
CREATE TABLE public.item (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  item_id text NOT NULL,
  name text NOT NULL,
  description text,
  texture text,
  value bigint,
  type text NOT NULL DEFAULT ''::text,
  stackable boolean,
  count integer DEFAULT 1,
  character_id uuid NOT NULL,
  consumable boolean DEFAULT false,
  CONSTRAINT item_pkey PRIMARY KEY (id),
  CONSTRAINT item_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.character(id)
);
CREATE TABLE public.object (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  x bigint NOT NULL,
  y bigint NOT NULL,
  texture text,
  height bigint,
  width bigint,
  solid boolean NOT NULL DEFAULT false,
  name_visible boolean NOT NULL DEFAULT false,
  type text DEFAULT 'object'::text,
  object_id text,
  CONSTRAINT object_pkey PRIMARY KEY (id)
);