import { supabase } from "@/lib/db";

export async function createEarlyAccessRequest(
  leadId: string,
  investmentRange: string,
  intentLevel: string,
  city?: string | null,
  notes?: string | null,
  environment: string = "DEV"
) {
  if (!leadId) {
    throw new Error("createEarlyAccessRequest: leadId is required");
  }

  const { error } = await supabase.rpc("create_early_access_request", {
    _lead_id: leadId,
    _investment_range: investmentRange,
    _intent_level: intentLevel,
    _environment: environment,
    _city: city || null,
    _notes: notes || null,
  });

  if (error) {
    // Preserve the error code for duplicate handling
    if (error.code === "23505") {
      const customError: any = new Error("You have already requested early access.");
      customError.code = "23505";
      throw customError;
    }
    throw new Error(`Error creating early access request: ${error.message}`);
  }
}
