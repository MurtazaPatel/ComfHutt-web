import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv(filepath: string) {
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    content.split('\n').forEach(line => {
      const [key, ...values] = line.split('=');
      if (key && values.length > 0) {
        const val = values.join('=').trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
        }
      }
    });
  } catch (e) {
    // ignore
  }
}

loadEnv(path.resolve(process.cwd(), '.env'));
loadEnv(path.resolve(process.cwd(), '.env.local'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function main() {
  console.log("Starting RPC Verification...");
  const timestamp = Date.now();
  const testEmail = `verify_${timestamp}@test.com`;
  let leadId: string | null = null;

  // 1. upsert_lead
  console.log("\nTesting upsert_lead...");
  const { data: lData, error: lError } = await supabase.rpc('upsert_lead', {
    _email: testEmail,
    _name: "Verification Script",
    _source: "OTHER",
    _environment: "DEV"
  });

  if (lError) {
    console.error("upsert_lead FAILED:", lError);
    process.exit(1);
  } else {
    console.log("upsert_lead SUCCEEDED. ID:", lData);
    if (typeof lData !== 'string') {
        console.error("upsert_lead returned non-string:", lData);
        process.exit(1);
    }
    leadId = lData as string;
  }

  if (!leadId) {
    console.error("Cannot proceed without leadId");
    process.exit(1);
  }

  // 2. create_early_access_request
  console.log("\nTesting create_early_access_request...");
  const { error: eaError } = await supabase.rpc('create_early_access_request', {
    _lead_id: leadId,
    _investment_range: "BELOW_10K",
    _intent_level: "LOW",
    _environment: "DEV",
    _city: "Test City",
    _notes: "Test Notes"
  });
  
  if (eaError) console.error("create_early_access_request FAILED:", eaError);
  else console.log("create_early_access_request SUCCEEDED");

  // 3. create_choice_responses
  console.log("\nTesting create_choice_responses...");
  const { error: cError } = await supabase.rpc('create_choice_responses', {
    _lead_id: leadId,
    _responses: [{ key: "test_key", value: "test_value" }],
    _environment: "DEV"
  });

  if (cError) console.error("create_choice_responses FAILED:", cError);
  else console.log("create_choice_responses SUCCEEDED");

  // 4. create_contact_message
  console.log("\nTesting create_contact_message...");
  const { error: cmError } = await supabase.rpc('create_contact_message', {
    _lead_id: leadId,
    _subject: "Test Subject",
    _message: "Test Message",
    _environment: "DEV"
  });

  if (cmError) {
      console.error("create_contact_message FAILED:", cmError);
  } else {
      console.log("create_contact_message SUCCEEDED");
  }

  // 5. Verify Data Read
  console.log("\nVerifying Data Read...");
  
  // Check choices
  const { data: choices, error: rError } = await supabase
    .from('choices_responses')
    .select('*')
    .eq('lead_id', leadId);
    
  if (rError) console.error("Read choices FAILED:", rError);
  else {
      console.log(`Read choices: Found ${choices?.length} rows`);
      if (choices && choices.length > 0) {
          console.log("Choice Row 1:", choices[0]);
      } else {
          console.error("Choice row NOT found!");
      }
  }

  // Check contact
  const { data: contacts, error: r2Error } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('lead_id', leadId);

  if (r2Error) console.error("Read contact FAILED:", r2Error);
  else {
      console.log(`Read contact: Found ${contacts?.length} rows`);
      if (contacts && contacts.length > 0) {
          console.log("Contact Row 1:", contacts[0]);
      } else {
          console.error("Contact row NOT found!");
      }
  }
}

main().catch(console.error);
