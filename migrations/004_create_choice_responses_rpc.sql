-- Create function
CREATE OR REPLACE FUNCTION create_choice_responses(
  _lead_id uuid,
  _responses jsonb,
  _environment text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item jsonb;
BEGIN
  -- Iterate over the JSONB array
  FOR item IN SELECT * FROM jsonb_array_elements(_responses)
  LOOP
    INSERT INTO choices_responses (
      lead_id,
      choice_key,
      choice_value,
      environment,
      created_at
    )
    VALUES (
      _lead_id::text,              -- Cast UUID param to TEXT to match table
      item->>'key',
      item->>'value',
      _environment::"Environment", -- Cast text to Enum
      now()
    );
  END LOOP;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION create_choice_responses(uuid, jsonb, text) TO anon, authenticated, service_role;
