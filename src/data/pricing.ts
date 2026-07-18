// One-time unlock price (INR) to deploy/share an invite in this tier.
// Edit these to change pricing. Keep in sync with api/create-order.js —
// that's the value actually charged; this one is display-only.
export const TIER_PRICE: Record<"gold" | "platinum", number> = {
  gold: 149,
  platinum: 299,
};
