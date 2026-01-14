-- create_contact_message
CREATE OR REPLACE FUNCTION create_contact_message(
  _lead_id uuid,
  _subject text,
  _message text,
  _environment "Environment"
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO contact_messages (lead_id, subject, message, environment, created_at)
  VALUES (_lead_id::text, _subject, _message, _environment, now());
END;
$$;

-- upsert_owner
CREATE OR REPLACE FUNCTION upsert_owner(
  _name text,
  _email text,
  _phone text,
  _address text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  owner_id uuid;
BEGIN
  INSERT INTO "Owner" (name, email, phone, address, "createdAt", "updatedAt")
  VALUES (_name, _email, _phone, _address, now(), now())
  ON CONFLICT (email) DO UPDATE
  SET name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      address = EXCLUDED.address,
      "updatedAt" = now()
  RETURNING id::uuid INTO owner_id;
  
  RETURN owner_id;
END;
$$;

-- create_property
CREATE OR REPLACE FUNCTION create_property(
  _owner_id uuid,
  _title text,
  _type text,
  _location text,
  _built_up_area float8,
  _carpet_area float8,
  _expected_valuation float8
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  prop_id uuid;
BEGIN
  INSERT INTO "Property" ("ownerId", title, type, location, "builtUpArea", "carpetArea", "expectedValuation", "createdAt", "updatedAt")
  VALUES (_owner_id::text, _title, _type, _location, _built_up_area, _carpet_area, _expected_valuation, now(), now())
  RETURNING id::uuid INTO prop_id;
  
  RETURN prop_id;
END;
$$;

-- create_property_documents
CREATE OR REPLACE FUNCTION create_property_documents(
  _property_id uuid,
  _documents jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  doc jsonb;
BEGIN
  FOR doc IN SELECT * FROM jsonb_array_elements(_documents)
  LOOP
    INSERT INTO "PropertyDocument" ("propertyId", type, url, "createdAt")
    VALUES (_property_id::text, doc->>'type', doc->>'url', now());
  END LOOP;
  RETURN true;
END;
$$;

-- create_user
CREATE OR REPLACE FUNCTION create_user(
  _email text,
  _password_hash text,
  _name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO "User" (email, "passwordHash", name, "createdAt", "updatedAt")
  VALUES (_email, _password_hash, _name, now(), now());
END;
$$;

-- log_lead_event
CREATE OR REPLACE FUNCTION log_lead_event(
  _lead_id uuid,
  _event_type text,
  _source text,
  _metadata jsonb,
  _environment "Environment"
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO lead_events (lead_id, event_type, source, metadata, environment, created_at)
  VALUES (_lead_id::text, _event_type, _source, _metadata, _environment, now());
END;
$$;
