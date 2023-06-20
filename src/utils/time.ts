export function printTimePeriod(startDate: string, endDate?: string | null) {
  const start = new Date(startDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
  const end = endDate
    ? new Date(endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "Present";
  return `${start} - ${end}`;
}
