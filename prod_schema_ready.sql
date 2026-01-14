CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE FUNCTION public.create_choice_responses(_environment text, _lead_id uuid, _responses jsonb) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  insert into choices_responses (
    id,
    lead_id,
    choice_key,
    choice_value,
    environment,
    created_at
  )
  select
    gen_random_uuid(),
    _lead_id,
    elem->>'key',
    elem->>'value',
    _environment,
    now()
  from jsonb_array_elements(_responses) as elem;
end;
$$;

CREATE FUNCTION public.create_contact_message(_environment text, _lead_id uuid, _message text, _subject text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  insert into contact_messages (
    id,
    lead_id,
    message,
    subject,
    environment,
    created_at
  )
  values (
    gen_random_uuid(),
    _lead_id,
    _message,
    _subject,
    _environment,
    now()
  );
end;
$$;

CREATE FUNCTION public.create_early_access_request(_lead_id uuid, _investment_range text, _intent_level text, _environment text, _notes text DEFAULT NULL::text, _city text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  request_id uuid;
begin
  insert into early_access_requests (
    lead_id,
    investment_range,
    intent_level,
    environment,
    notes,
    city,
    created_at
  )
  values (
    _lead_id,
    _investment_range,
    _intent_level,
    _environment,
    _notes,
    _city,
    now()
  )
  returning id into request_id;

  return request_id;
end;
$$;

CREATE FUNCTION public.upsert_lead(_email text, _environment text, _name text DEFAULT NULL::text, _source text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  lead_uuid uuid;
begin
  -- Find existing lead
  select id into lead_uuid
  from users_leads
  where email = _email
    and environment = _environment;

  if lead_uuid is not null then
    update users_leads
    set
      last_seen_at = now(),
      name = coalesce(_name, name),
      source = coalesce(_source, source)
    where id = lead_uuid;

    return lead_uuid;
  end if;

  -- Create new lead
  insert into users_leads (
    email,
    environment,
    name,
    source,
    first_seen_at,
    last_seen_at
  )
  values (
    _email,
    _environment,
    _name,
    _source,
    now(),
    now()
  )
  returning id into lead_uuid;

  return lead_uuid;
end;
$$;

CREATE TABLE public."Property" (
    id text NOT NULL,
    "ownerId" text NOT NULL,
    title text NOT NULL,
    location text,
    "builtUpArea" double precision,
    "carpetArea" double precision,
    "expectedValuation" double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    bedrooms integer DEFAULT 0 NOT NULL,
    city text DEFAULT ''::text NOT NULL,
    "credibilityScore" integer DEFAULT 0 NOT NULL,
    "lastRescoredAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    locality text DEFAULT ''::text NOT NULL,
    "minTokenPriceInr" double precision DEFAULT 0 NOT NULL,
    photos text[],
    "possessionStatus" text DEFAULT 'Ready'::text NOT NULL,
    "priceInr" double precision DEFAULT 0 NOT NULL,
    "projectedYieldPercent" double precision DEFAULT 0 NOT NULL,
    rera text,
    "shortDescription" text DEFAULT ''::text NOT NULL,
    source text DEFAULT 'manual'::text NOT NULL,
    "spvBacked" boolean DEFAULT false NOT NULL,
    state text DEFAULT ''::text NOT NULL,
    "tokensSold" integer DEFAULT 0 NOT NULL,
    "tokensTotal" integer DEFAULT 0 NOT NULL,
    type text NOT NULL
);

CREATE TABLE public.choices_responses (
    id uuid NOT NULL,
    lead_id uuid,
    choice_key text,
    choice_value text,
    created_at timestamp with time zone,
    environment text
);

CREATE TABLE public.contact_messages (
    id uuid NOT NULL,
    lead_id uuid,
    subject text,
    message text,
    responded boolean DEFAULT false,
    created_at timestamp with time zone,
    environment text
);

CREATE TABLE public.early_access_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lead_id uuid,
    investment_range text,
    city text,
    intent_level text,
    notes text,
    created_at timestamp with time zone,
    environment text
);

CREATE TABLE public.lead_events (
    id uuid NOT NULL,
    lead_id uuid,
    event_type text,
    metadata jsonb,
    created_at timestamp with time zone,
    environment text
);

CREATE TABLE public.page_sessions (
    id uuid NOT NULL,
    lead_id uuid,
    page text,
    referrer text,
    utm_source text,
    utm_campaign text,
    created_at timestamp with time zone,
    environment text
);

CREATE TABLE public.users_leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text,
    phone text,
    name text,
    source text,
    first_seen_at timestamp with time zone,
    last_seen_at timestamp with time zone,
    environment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT users_leads_source_check CHECK ((source = ANY (ARRAY['EARLY_ACCESS'::text, 'CHOICES'::text, 'CONTACT'::text, 'OTHER'::text])))
);

ALTER TABLE ONLY public."Property"
    ADD CONSTRAINT "Property_pkey" PRIMARY KEY (id);

ALTER TABLE ONLY public.choices_responses
    ADD CONSTRAINT choices_responses_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.early_access_requests
    ADD CONSTRAINT early_access_requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.lead_events
    ADD CONSTRAINT lead_events_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.page_sessions
    ADD CONSTRAINT page_sessions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users_leads
    ADD CONSTRAINT users_leads_email_environment_unique UNIQUE (email, environment);

ALTER TABLE ONLY public.users_leads
    ADD CONSTRAINT users_leads_pkey PRIMARY KEY (id);

CREATE INDEX idx_choices_responses_lead_id ON public.choices_responses USING btree (lead_id);

CREATE INDEX idx_contact_messages_lead_id ON public.contact_messages USING btree (lead_id);

CREATE INDEX idx_early_access_requests_lead_id ON public.early_access_requests USING btree (lead_id);

CREATE INDEX idx_lead_events_lead_id ON public.lead_events USING btree (lead_id);

CREATE INDEX idx_page_sessions_lead_id ON public.page_sessions USING btree (lead_id);

CREATE INDEX idx_users_leads_email ON public.users_leads USING btree (email);

ALTER TABLE ONLY public.choices_responses
    ADD CONSTRAINT choices_responses_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.users_leads(id);

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.users_leads(id);

ALTER TABLE ONLY public.early_access_requests
    ADD CONSTRAINT early_access_requests_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.users_leads(id);

ALTER TABLE ONLY public.lead_events
    ADD CONSTRAINT lead_events_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.users_leads(id);

ALTER TABLE ONLY public.page_sessions
    ADD CONSTRAINT page_sessions_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.users_leads(id);

ALTER TABLE public."Property"
    ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;