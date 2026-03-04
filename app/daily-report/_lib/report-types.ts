export type EmployeeRole =
  | "video-editor"
  | "videographer"
  | "script-writer"
  | "account-manager"
  | "graphic-designer";

export type EmployeeSlug =
  | "kian"
  | "arcen"
  | "salma"
  | "dominika"
  | "meg"
  | "borna"
  | "pouria"
  | "faez"
  | "zahir";

export interface EmployeeConfig {
  name: string;
  slug: EmployeeSlug;
  roles: EmployeeRole[];
}
