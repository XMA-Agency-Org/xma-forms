import axios from "axios";

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API = "https://api.airtable.com/v0";

const TODAY = "05/03/2026";

const employees = [
  {
    name: "Kian",
    slug: "kian",
    roles: ["videographer", "video-editor"],
    data: {
      workMode: "Office",
      shootEntries: [
        { client: "Client A", shootDescription: "Product shoot", videosCaptured: 5, entryNotes: "Test shoot" },
      ],
      editingEntries: [
        { client: "Client B", videosEdited: 3, cutsMade: 12, editorRevisionsCompleted: 2, pendingRevisions: 1 },
      ],
    },
  },
  {
    name: "Arcen",
    slug: "arcen",
    roles: ["video-editor"],
    data: {
      workMode: "Remote",
      editingEntries: [
        { client: "Client A", videosEdited: 4, cutsMade: 8, editorRevisionsCompleted: 1, pendingRevisions: 0 },
      ],
    },
  },
  {
    name: "Salma",
    slug: "salma",
    roles: ["script-writer", "account-manager"],
    data: {
      workMode: "Office",
      scriptsWritten: 3,
      scriptsRevised: 1,
      avgScriptLength: "2 min",
      scriptsApproved: 2,
      accountEntries: [
        { client: "Client A", clientCallsDone: 2, issuesResolved: 1, deliverablesCoordinated: 3, escalations: 0 },
      ],
    },
  },
  {
    name: "Dominika",
    slug: "dominika",
    roles: ["script-writer", "account-manager"],
    data: {
      workMode: "Hybrid",
      scriptsWritten: 2,
      scriptsRevised: 2,
      avgScriptLength: "1.5 min",
      scriptsApproved: 1,
      accountEntries: [
        { client: "Client B", clientCallsDone: 3, issuesResolved: 2, deliverablesCoordinated: 1, escalations: 1 },
      ],
    },
  },
  {
    name: "Meg",
    slug: "meg",
    roles: ["script-writer", "account-manager"],
    data: {
      workMode: "Remote",
      scriptsWritten: 4,
      scriptsRevised: 0,
      avgScriptLength: "3 min",
      scriptsApproved: 3,
      accountEntries: [
        { client: "Internal", clientCallsDone: 1, issuesResolved: 0, deliverablesCoordinated: 2, escalations: 0 },
      ],
    },
  },
  {
    name: "Borna",
    slug: "borna",
    roles: ["graphic-designer"],
    data: {
      workMode: "Office",
      creativesProduced: 6,
      thumbnailsDesigned: 4,
      designRevisionsCompleted: 2,
      newConceptsDeveloped: 1,
    },
  },
  {
    name: "Pouria",
    slug: "pouria",
    roles: ["graphic-designer"],
    data: {
      workMode: "Remote",
      creativesProduced: 5,
      thumbnailsDesigned: 3,
      designRevisionsCompleted: 1,
      newConceptsDeveloped: 2,
    },
  },
  {
    name: "Faez",
    slug: "faez",
    roles: [],
    data: {
      workMode: "Office",
      notes: "Sprint planning and code reviews",
    },
  },
  {
    name: "Zahir",
    slug: "zahir",
    roles: [],
    data: {
      workMode: "Office",
      notes: "Strategy meeting and team sync",
    },
  },
];

interface AirtableTable {
  id: string;
  name: string;
  fields: { id: string; name: string; type: string }[];
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime: string;
}

const airtableHeaders = {
  Authorization: `Bearer ${AIRTABLE_TOKEN}`,
  "Content-Type": "application/json",
};

async function submitReport(employee: (typeof employees)[number]) {
  const payload = {
    employee: employee.slug,
    employeeName: employee.name,
    date: TODAY,
    ...employee.data,
  };

  const { data } = await axios.post(
    `${AIRTABLE_API}/submit/daily-report`,
    payload
  );
  return data;
}

function flattenEntries(data: Record<string, unknown>) {
  const CORE_FIELDS = ["date", "workMode", "notes"];
  const META_FIELDS = ["employee", "employeeName"];
  const ENTRY_ARRAYS = ["shootEntries", "editingEntries", "accountEntries"];

  const coreValues: Record<string, unknown> = {};
  CORE_FIELDS.forEach((key) => {
    if (data[key] !== undefined) coreValues[key] = data[key];
  });

  const flatFields: Record<string, unknown> = {};
  Object.keys(data).forEach((key) => {
    if (
      !META_FIELDS.includes(key) &&
      !CORE_FIELDS.includes(key) &&
      !ENTRY_ARRAYS.includes(key)
    ) {
      flatFields[key] = data[key];
    }
  });

  const rows: Record<string, unknown>[] = [];

  ENTRY_ARRAYS.forEach((arrayKey) => {
    const entries = data[arrayKey];
    if (!entries || !Array.isArray(entries)) return;
    const entryType = arrayKey.replace("Entries", "");
    entries.forEach((entry: Record<string, unknown>) => {
      rows.push({
        Timestamp: new Date().toISOString().split("T")[0],
        entryType,
        ...coreValues,
        ...entry,
        ...flatFields,
      });
    });
  });

  if (rows.length === 0) {
    rows.push({
      Timestamp: new Date().toISOString().split("T")[0],
      ...coreValues,
      ...flatFields,
    });
  }

  return rows;
}

async function getExistingTables(): Promise<string[]> {
  const { data } = await axios.get(
    `${AIRTABLE_API}/meta/bases/${AIRTABLE_BASE_ID}/tables`,
    { headers: airtableHeaders }
  );
  return (data.tables as { name: string }[]).map((t) => t.name);
}

async function createTable(tableName: string, rows: Record<string, unknown>[]) {
  const fieldNames = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((k) => fieldNames.add(k)));

  const fields = Array.from(fieldNames).map((name) => {
    if (name === "Timestamp" || name === "date") {
      return { name, type: "date", options: { dateFormat: { name: "iso" } } };
    }
    return { name, type: "singleLineText" };
  });

  await axios.post(
    `${AIRTABLE_API}/meta/bases/${AIRTABLE_BASE_ID}/tables`,
    { name: tableName, fields },
    { headers: airtableHeaders }
  );
}

async function insertRecords(tableName: string, rows: Record<string, unknown>[]) {
  const records = rows.map((row) => {
    const fields: Record<string, unknown> = {};
    Object.entries(row).forEach(([key, value]) => {
      if (key === "date" && typeof value === "string") {
        const [dd, mm, yyyy] = value.split("/");
        fields[key] = `${yyyy}-${mm}-${dd}`;
      } else if (key === "Timestamp") {
        fields[key] = value;
      } else {
        fields[key] = value !== undefined && value !== null ? String(value) : "";
      }
    });
    return { fields };
  });

  const batches = [];
  for (let i = 0; i < records.length; i += 10) {
    batches.push(records.slice(i, i + 10));
  }

  for (const batch of batches) {
    await axios.post(
      `${AIRTABLE_API}/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`,
      { records: batch },
      { headers: airtableHeaders }
    );
  }
}

async function getAllTables(): Promise<AirtableTable[]> {
  const { data } = await axios.get(
    `${AIRTABLE_API}/meta/bases/${AIRTABLE_BASE_ID}/tables`,
    { headers: airtableHeaders }
  );
  return data.tables;
}

async function getTableRecords(tableName: string): Promise<AirtableRecord[]> {
  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params = offset ? `?offset=${offset}` : "";
    const { data } = await axios.get(
      `${AIRTABLE_API}/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}${params}`,
      { headers: airtableHeaders }
    );
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  return allRecords;
}

function printTable(records: AirtableRecord[]) {
  if (records.length === 0) {
    console.log("  (no records)\n");
    return;
  }

  const allKeys = new Set<string>();
  records.forEach((r) => Object.keys(r.fields).forEach((k) => allKeys.add(k)));
  const columns = Array.from(allKeys);

  const colWidths = columns.map((col) => {
    const maxVal = Math.max(
      ...records.map((r) => String(r.fields[col] ?? "").length)
    );
    return Math.max(col.length, Math.min(maxVal, 40));
  });

  const header = columns.map((col, i) => col.padEnd(colWidths[i])).join(" | ");
  const separator = colWidths.map((w) => "-".repeat(w)).join("-+-");

  console.log(`  ${header}`);
  console.log(`  ${separator}`);

  records.forEach((record) => {
    const row = columns
      .map((col, i) => {
        const val = String(record.fields[col] ?? "");
        return val.length > 40 ? val.slice(0, 37) + "..." : val.padEnd(colWidths[i]);
      })
      .join(" | ");
    console.log(`  ${row}`);
  });

  console.log();
}

async function main() {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.error("Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID");
    process.exit(1);
  }

  console.log("=== STEP 1: Submitting test reports for all employees ===\n");

  const existingTables = await getExistingTables();

  for (const emp of employees) {
    console.log(`Submitting for ${emp.name}...`);

    const payload = {
      employee: emp.slug,
      employeeName: emp.name,
      date: TODAY,
      ...emp.data,
    };

    const rows = flattenEntries(payload);

    if (!existingTables.includes(emp.name)) {
      console.log(`  Creating table "${emp.name}"...`);
      await createTable(emp.name, rows);
      existingTables.push(emp.name);
    }

    await insertRecords(emp.name, rows);
    console.log(`  Inserted ${rows.length} row(s)`);
  }

  console.log("\n=== STEP 2: Reading all tables back ===\n");

  const tables = await getAllTables();
  console.log(`Found ${tables.length} table(s):\n`);

  for (const table of tables) {
    console.log(`=== ${table.name} ===`);
    console.log(
      `Fields: ${table.fields.map((f) => `${f.name} (${f.type})`).join(", ")}\n`
    );

    const records = await getTableRecords(table.name);
    console.log(`Records: ${records.length}`);
    printTable(records);
  }
}

main().catch((err) => {
  console.error("Error:", err.response?.data || err.message || err);
  process.exit(1);
});
