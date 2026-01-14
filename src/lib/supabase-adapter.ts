// @ts-nocheck
import { SupabaseClient } from "@supabase/supabase-js";
import { Adapter } from "next-auth/adapters";

export function SupabaseAdapter(client: SupabaseClient): Adapter {
  return {
    async createUser(user) {
      const { data, error } = await client
        .from("users")
        .insert({
          name: user.name,
          email: user.email,
          email_verified: user.emailVerified,
          image: user.image,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async getUser(id) {
      const { data, error } = await client
        .from("users")
        .select()
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    async getUserByEmail(email) {
      const { data, error } = await client
        .from("users")
        .select()
        .eq("email", email)
        .single();
      if (error) throw error;
      return data;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const { data, error } = await client
        .from("accounts")
        .select("users(*)")
        .eq("provider_account_id", providerAccountId)
        .eq("provider", provider)
        .single();
      if (error) throw error;
      return data?.users?.[0] ?? null;
    },
    async updateUser(user) {
      const { data, error } = await client
        .from("users")
        .update({
          name: user.name,
          email: user.email,
          email_verified: user.emailVerified,
          image: user.image,
        })
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async deleteUser(userId) {
      const { error } = await client.from("users").delete().eq("id", userId);
      if (error) throw error;
    },
    async linkAccount(account) {
      const { error } = await client.from("accounts").insert(account);
      if (error) throw error;
    },
    async unlinkAccount({ providerAccountId, provider }) {
      const { error } = await client
        .from("accounts")
        .delete()
        .eq("provider_account_id", providerAccountId)
        .eq("provider", provider);
      if (error) throw error;
    },
    async createSession({ sessionToken, userId, expires }) {
      const { data, error } = await client
        .from("sessions")
        .insert({
          session_token: sessionToken,
          user_id: userId,
          expires,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async getSessionAndUser(sessionToken) {
      const { data, error } = await client
        .from("sessions")
        .select("*, users(*)")
        .eq("session_token", sessionToken)
        .single();
      if (error) throw error;
      if (!data) return null;
      const { users: user, ...session } = data;
      return { session, user };
    },
    async updateSession({ sessionToken, expires }) {
      const { data, error } = await client
        .from("sessions")
        .update({ expires })
        .eq("session_token", sessionToken)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    async deleteSession(sessionToken) {
      const { error } = await client
        .from("sessions")
        .delete()
        .eq("session_token", sessionToken);
      if (error) throw error;
    },
    async createVerificationToken({ identifier, expires, token }) {
        const { data, error } = await client
            .from("verification_tokens")
            .insert({
                identifier,
                expires,
                token,
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },
    async useVerificationToken({ identifier, token }) {
        const { data, error } = await client
            .from("verification_tokens")
            .delete()
            .eq("identifier", identifier)
            .eq("token", token)
            .select()
            .single();
        if (error) throw error;
        return data;
    },
  };
}
