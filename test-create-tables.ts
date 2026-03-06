import axios from "axios";

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API = "https://api.airtable.com/v0";

const TODAY = "05/03/2026";

const airtableHeaders = {
  Authorization: `Bearer ${AIRTABLE_TOKEN}`,
  "Content-Type": "application/json",
};

const employees = [
  {
    name: "Kian Khamushi",
    data: {
      date: TODAY,
      notes: "Test entry",
    },
  },
  {
    name: "Rene",
    data: {
      date: TODAY,
      outreaches: "0",
      appointmentsSet: "0",
      notes: "Test entry",
    },
  },
];

function formatDate(ddmmyyyy: string) {
  const [dd, mm, yyyy] = ddmmyyyy.split("/");
  return `${yyyy}-${mm}-${dd}`;
}

async function getExistingTables(): Promise<string[]> {
  const { data } = await axios.get(
    `${AIRTABLE_API}/meta/bases/${AIRTABLE_BASE_ID}/tables`,
    { headers: airtableHeaders }
  );
  return (data.tables as { name: string }[]).map((t) => t.name);
}

async function createTable(tableName: string, row: Record<string, string>) {
  const fields = Object.keys(row).map((name) => {
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

async function insertRecord(tableName: string, row: Record<string, string>) {
  const fields: Record<string, string> = {};
  Object.entries(row).forEach(([key, value]) => {
    if (key === "date") {
      fields[key] = formatDate(value);
    } else {
      fields[key] = value;
    }
  });

  await axios.post(
    `${AIRTABLE_API}/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`,
    { records: [{ fields }] },
    { headers: airtableHeaders }
  );
}

async function getTableRecords(tableName: string) {
  const { data } = await axios.get(
    `${AIRTABLE_API}/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`,
    { headers: airtableHeaders }
  );
  return data.records as { fields: Record<string, unknown> }[];
}

async function main() {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.error("Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID");
    process.exit(1);
  }

  const existingTables = await getExistingTables();

  for (const emp of employees) {
    const row = { Timestamp: new Date().toISOString().split("T")[0], ...emp.data };

    if (existingTables.includes(emp.name)) {
      console.log(`"${emp.name}" table already exists, skipping creation.`);
    } else {
      console.log(`Creating table "${emp.name}"...`);
      await createTable(emp.name, row);
    }

    console.log(`  Inserting test record...`);
    await insertRecord(emp.name, row);
  }

  console.log("\n=== Verifying tables ===\n");

  for (const emp of employees) {
    const records = await getTableRecords(emp.name);
    console.log(`${emp.name} — ${records.length} record(s)`);
    records.forEach((r) => {
      const vals = Object.entries(r.fields)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      console.log(`  ${vals}`);
    });
    console.log();
  }
}

main().catch((err) => {
  console.error("Error:", err.response?.data || err.message || err);
  process.exit(1);
});
