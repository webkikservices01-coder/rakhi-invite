// @cashfreepayments/cashfree-js ships no type declarations — this covers
// only the surface this project actually calls (modal checkout).
declare module "@cashfreepayments/cashfree-js" {
  export interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_modal" | HTMLElement;
  }

  export interface CashfreeCheckoutResult {
    error?: { message: string };
    paymentDetails?: { paymentMessage: string };
    redirect?: boolean;
  }

  export interface Cashfree {
    checkout: (options: CashfreeCheckoutOptions) => Promise<CashfreeCheckoutResult>;
  }

  export function load(config: { mode: "sandbox" | "production" }): Promise<Cashfree>;
}
