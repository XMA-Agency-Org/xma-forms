export type EmployeeRole =
  | "video-editor"
  | "videographer"
  | "script-writer"
  | "account-manager"
  | "graphic-designer"
  | "salesman";

export type EmployeeSlug =
  | "kian"
  | "arcen"
  | "salma"
  | "dominika"
  | "meg"
  | "borna"
  | "pouria"
  | "faez"
  | "zahir"
  | "kian-khamoushi"
  | "mark"
  | "rene";

export interface EmployeeConfig {
  name: string;
  slug: EmployeeSlug;
  roles: EmployeeRole[];
}
