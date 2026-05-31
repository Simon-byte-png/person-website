export function parseAdminEmails(value = process.env.ADMIN_EMAILS ?? "") {
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined, source = process.env.ADMIN_EMAILS ?? "") {
  if (!email) {
    return false;
  }

  return parseAdminEmails(source).includes(email.trim().toLowerCase());
}
