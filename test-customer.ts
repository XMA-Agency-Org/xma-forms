import axios from "axios";

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API = "https://api.airtable.com/v0";

const airtableHeaders = {
  Authorization: `Bearer ${AIRTABLE_TOKEN}`,
  "Content-Type": "application/json",
};

const customer = {
  customerType: "individual",
  fullName: "Kian Khamushi",
  nationalIdNumber: "ID-KK-20260305",
  primaryContactPerson: "Kian Khamushi",
  phone: "+971501234567",
  email: "kian@example.com",
  billingStreet: "123 Business Bay",
  billingCity: "Dubai",
  billingState: "Dubai",
  billingPostalCode: "00000",
  billingCountry: "UAE",
  shippingAddressSameAsBilling: "Yes",
  trnVat: "TRN-100123456789",
  industryType: "Media & Entertainment",
  preferredCommunicationMethod: "whatsapp",
  Timestamp: new Date().toISOString().split("T")[0],
};

async function getExistingTables(): Promise<string[]> {
  const { data } = await axios.get(
    `${AIRTABLE_API}/meta/bases/${AIRTABLE_BASE_ID}/tables`,
    { headers: airtableHeaders }
  );
  return (data.tables as { name: string }[]).map((t) => t.name);
}

async function createTable(tableName: string, fields: { name: string; type: string; options?: unknown }[]) {
  await axios.post(
    `${AIRTABLE_API}/meta/bases/${AIRTABLE_BASE_ID}/tables`,
    { name: tableName, fields },
    { headers: airtableHeaders }
  );
}

async function insertRecord(tableName: string, fields: Record<string, unknown>) {
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
  return data.records;
}

async function main() {
  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.error("Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID");
    process.exit(1);
  }

  const tableName = "Customers";
  const existingTables = await getExistingTables();

  if (!existingTables.includes(tableName)) {
    console.log(`Creating "${tableName}" table...`);
    const fields = Object.keys(customer).map((name) => {
      if (name === "Timestamp") {
        return { name, type: "date", options: { dateFormat: { name: "iso" } } };
      }
      return { name, type: "singleLineText" };
    });
    await createTable(tableName, fields);
  }

  console.log(`Inserting Kian Khamushi as a customer...`);
  await insertRecord(tableName, customer);

  console.log(`\n=== ${tableName} ===`);
  const records = await getTableRecords(tableName);
  console.log(`Records: ${records.length}\n`);

  const allKeys = new Set<string>();
  records.forEach((r: { fields: Record<string, unknown> }) =>
    Object.keys(r.fields).forEach((k) => allKeys.add(k))
  );
  const columns = Array.from(allKeys);

  const colWidths = columns.map((col) => {
    const maxVal = Math.max(
      ...records.map((r: { fields: Record<string, unknown> }) =>
        String(r.fields[col] ?? "").length
      )
    );
    return Math.max(col.length, Math.min(maxVal, 40));
  });

  const header = columns.map((col, i) => col.padEnd(colWidths[i])).join(" | ");
  const separator = colWidths.map((w) => "-".repeat(w)).join("-+-");
  console.log(`  ${header}`);
  console.log(`  ${separator}`);

  records.forEach((record: { fields: Record<string, unknown> }) => {
    const row = columns
      .map((col, i) => {
        const val = String(record.fields[col] ?? "");
        return val.length > 40 ? val.slice(0, 37) + "..." : val.padEnd(colWidths[i]);
      })
      .join(" | ");
    console.log(`  ${row}`);
  });

  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Error:", err.response?.data || err.message || err);
  process.exit(1);
});
