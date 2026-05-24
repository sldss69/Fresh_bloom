export const ADMIN_SESSION_COOKIE = "fresh_bloom_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

const DEFAULT_ADMIN_USERNAME = "FRESH_BLOOM";
const DEFAULT_ADMIN_PASSWORD = "FB_2026";

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME ?? DEFAULT_ADMIN_USERNAME;
}

export function isValidAdminCredentials(username: string, password: string) {
  return (
    username.trim() === getAdminUsername() &&
    password === (process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD)
  );
}

export async function createAdminSessionToken() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ??
    `${getAdminUsername()}:${process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD}`;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`fresh-bloom-admin:${secret}`),
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function hasValidAdminSession(sessionValue?: string) {
  if (!sessionValue) {
    return false;
  }

  return constantTimeEqual(sessionValue, await createAdminSessionToken());
}

export function getSafeAdminRedirect(value: FormDataEntryValue | string | null) {
  const target = typeof value === "string" ? value : "";

  if (!target.startsWith("/") || target.startsWith("//")) {
    return "/admin";
  }

  if (target.startsWith("/admin/login")) {
    return "/admin";
  }

  return target;
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}
