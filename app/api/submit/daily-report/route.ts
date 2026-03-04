import { NextResponse } from "next/server";

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API = "https://api.airtable.com/v0";

const CORE_FIELDS = ["date", "workMode", "notes"];
const META_FIELDS = ["employee", "employeeName"];
const ENTRY_ARRAYS = ["shootEntries", "editingEntries", "accountEntries"];

function flattenEntries(data: Record<string, unknown>) {
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

async function airtableFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${AIRTABLE_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `Airtable API error: ${response.status} ${JSON.stringify(body)}`
    );
  }

  return body;
}

async function getExistingTables(): Promise<string[]> {
  const data = await airtableFetch(
    `/meta/bases/${AIRTABLE_BASE_ID}/tables`
  );
  return (data.tables as { name: string }[]).map((t) => t.name);
}

async function createTable(
  tableName: string,
  rows: Record<string, unknown>[]
) {
  const fieldNames = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((k) => fieldNames.add(k)));

  const fields = Array.from(fieldNames).map((name) => {
    if (name === "Timestamp" || name === "date") {
      return {
        name,
        type: "date",
        options: { dateFormat: { name: "iso" } },
      };
    }
    return { name, type: "singleLineText" };
  });

  await airtableFetch(`/meta/bases/${AIRTABLE_BASE_ID}/tables`, {
    method: "POST",
    body: JSON.stringify({ name: tableName, fields }),
  });
}

async function insertRecords(
  tableName: string,
  rows: Record<string, unknown>[]
) {
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
    await airtableFetch(`/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`, {
      method: "POST",
      body: JSON.stringify({ records: batch }),
    });
  }
}

export async function POST(request: Request) {
  try {
    if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
      return NextResponse.json(
        { error: "Airtable credentials not configured" },
        { status: 500 }
      );
    }

    const data = await request.json();
    const employeeName = data.employeeName as string;

    if (!employeeName) {
      return NextResponse.json(
        { error: "Missing employeeName" },
        { status: 400 }
      );
    }

    const rows = flattenEntries(data);

    const existingTables = await getExistingTables();
    if (!existingTables.includes(employeeName)) {
      await createTable(employeeName, rows);
    }

    await insertRecords(employeeName, rows);

    return NextResponse.json({
      status: "success",
      employee: employeeName,
      rows: rows.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Daily report submission error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
