// Membership source of truth: a Google Sheet published to the web as CSV.
// Columns: "Email" and (optionally) "Active" (TRUE/FALSE).
// The CSV URL lives in MEMBER_EMAILS_CSV_URL and is only ever read server-side.

const CSV_URL = process.env.MEMBER_EMAILS_CSV_URL;
const TTL_MS = 60_000; // re-fetch the sheet at most once a minute

let cache: { emails: Set<string>; at: number } | null = null;

function parseActiveEmails(csv: string): Set<string> {
  const lines = csv.trim().split(/\r?\n/);
  const set = new Set<string>();
  if (lines.length === 0) return set;

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const emailIdx = header.indexOf("email");
  const activeIdx = header.indexOf("active");

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const email = (emailIdx >= 0 ? cols[emailIdx] : cols[0])
      ?.trim()
      .toLowerCase();
    if (!email || !email.includes("@")) continue;

    // If there's an Active column, only count rows that aren't explicitly off.
    if (activeIdx >= 0) {
      const active = (cols[activeIdx] ?? "").trim().toLowerCase();
      const isActive = active === "" || ["true", "1", "yes"].includes(active);
      if (!isActive) continue;
    }

    set.add(email);
  }
  return set;
}

async function loadMembers(): Promise<Set<string>> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.emails;
  if (!CSV_URL) throw new Error("MEMBER_EMAILS_CSV_URL is not set");

  try {
    const res = await fetch(CSV_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`members sheet fetch failed: ${res.status}`);
    const emails = parseActiveEmails(await res.text());
    cache = { emails, at: Date.now() };
    return emails;
  } catch (err) {
    // On a transient fetch failure, serve the last known list rather than
    // locking everyone out. Only hard-fail if we've never loaded it.
    if (cache) return cache.emails;
    throw err;
  }
}

/** Is this email an active Skool member? Used by the dashboard gate. */
export async function isMember(email: string): Promise<boolean> {
  const set = await loadMembers();
  return set.has(email.trim().toLowerCase());
}
