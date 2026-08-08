export const STAFF_ROLES = [
  "director",
  "coordinator",
  "academic",
  "moderator",
  "technical_admin",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  director: "Director",
  coordinator: "Coordinador",
  academic: "Académico / Validador",
  moderator: "Moderador",
  technical_admin: "Administrador técnico",
};

export function isStaffRole(value: string): value is StaffRole {
  return STAFF_ROLES.includes(value as StaffRole);
}

