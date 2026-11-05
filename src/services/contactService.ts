import { supabase } from "../lib/supabaseClient";

interface SendContactMessageInput {
  name: string;
  email: string;
  message: string;
}

export async function sendContactMessage({
  name,
  email,
  message,
}: SendContactMessageInput): Promise<void> {
  // No .select() here on purpose: nobody may read this table,
  // so asking for the inserted row back would fail.
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email, message });
  if (error) {
    throw error;
  }
}
