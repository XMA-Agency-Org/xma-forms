import type { EmployeeConfig, EmployeeSlug } from "./report-types";

export const employeeConfigs: Record<EmployeeSlug, EmployeeConfig> = {
  kian: {
    name: "Kian",
    slug: "kian",
    roles: ["videographer", "video-editor"],
  },
  arcen: {
    name: "Arcen",
    slug: "arcen",
    roles: ["video-editor"],
  },
  salma: {
    name: "Salma",
    slug: "salma",
    roles: ["script-writer", "account-manager"],
  },
  dominika: {
    name: "Dominika",
    slug: "dominika",
    roles: ["script-writer", "account-manager"],
  },
  meg: {
    name: "Meg",
    slug: "meg",
    roles: ["script-writer", "account-manager"],
  },
  borna: {
    name: "Borna",
    slug: "borna",
    roles: ["graphic-designer"],
  },
  pouria: {
    name: "Pouria",
    slug: "pouria",
    roles: ["graphic-designer"],
  },
  faez: {
    name: "Faez",
    slug: "faez",
    roles: [],
  },
  zahir: {
    name: "Zahir",
    slug: "zahir",
    roles: [],
  },
};

export function getEmployeeConfig(slug: string): EmployeeConfig | undefined {
  return employeeConfigs[slug as EmployeeSlug];
}

export function getAllEmployeeSlugs(): EmployeeSlug[] {
  return Object.keys(employeeConfigs) as EmployeeSlug[];
}
