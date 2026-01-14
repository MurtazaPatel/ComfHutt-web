import { supabase } from "@/lib/db";

export async function upsertLead(
  email: string,
  name: string | undefined | null,
  source: string,
  environment: string = "DEV"
) {
  const { data: leadId, error } = await supabase.rpc("upsert_lead", {
    _email: email,
    _name: name || null,
    _source: source,
    _environment: environment,
  });

  if (error) {
    throw new Error(`Error upserting lead: ${error.message}`);
  }

  if (!leadId || typeof leadId !== "string") {
    throw new Error("Upserted lead is missing ID");
  }

  return leadId;
}

export async function logLeadEvent(
  leadId: string,
  eventType: string,
  source: string,
  metadata?: Record<string, any>,
  environment: string = "DEV"
) {
  const { error } = await supabase.rpc("log_lead_event", {
    _lead_id: leadId,
    _event_type: eventType,
    _source: source,
    _metadata: metadata || null,
    _environment: environment,
  });

  if (error) {
    // We log but don't throw for non-critical event logging,
    // or we can decide to throw. The requirement says "Every helper throws on Supabase error".
    // But for logging, it might be better to just log the error.
    // However, sticking to the requirement: "No silent failures" implies throwing might be safer for strictness,
    // but usually logging is best-effort.
    // The requirement "Every helper throws on Supabase error" seems strict.
    // I will throw here, and let the caller catch and decide if it's critical.
    throw new Error(`Error logging lead event: ${error.message}`);
  }
}
