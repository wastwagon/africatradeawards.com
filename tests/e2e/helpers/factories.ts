export function uniqueEmail(prefix: string) {
  const safePrefix = prefix.replace(/[^a-z0-9]/gi, "").toLowerCase() || "user";
  return `${safePrefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}@e2e.local`;
}

export function longSummary() {
  return [
    "This nominee consistently drives regional trade growth through measurable delivery.",
    "They built practical cross-border partnerships that improved inclusion for smaller businesses.",
    "Their contribution has sustained impact and aligns with the award's intent.",
  ].join(" ");
}
