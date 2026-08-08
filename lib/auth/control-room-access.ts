import { createSupabaseServerClient } from "../supabase/server";
import { isStaffRole, type StaffRole } from "./roles";

export type ControlRoomAccess =
  | { state: "unconfigured" }
  | { state: "unauthenticated" }
  | { state: "denied"; email: string | null }
  | {
      state: "authorized";
      email: string | null;
      role: StaffRole;
      canValidate: boolean;
    };

export async function getControlRoomAccess(): Promise<ControlRoomAccess> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { state: "unconfigured" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { state: "unauthenticated" };
  }

  const { data: assignments } = await supabase
    .from("user_roles")
    .select("role, can_validate")
    .eq("user_id", user.id)
    .is("revoked_at", null)
    .order("granted_at", { ascending: true })
    .limit(1);

  const assignment = assignments?.[0];

  if (!assignment || !isStaffRole(assignment.role)) {
    return { state: "denied", email: user.email ?? null };
  }

  return {
    state: "authorized",
    email: user.email ?? null,
    role: assignment.role,
    canValidate: assignment.can_validate,
  };
}

