const CF_ENV = process.env.CASHFREE_ENV === "production" ? "production" : "sandbox";

export const CF_BASE_URL =
  CF_ENV === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

export const CF_API_VERSION = "2025-01-01";

export function cfHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-version": CF_API_VERSION,
    "x-client-id": process.env.CASHFREE_CLIENT_ID,
    "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
  };
}
