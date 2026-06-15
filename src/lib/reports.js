export function filterSalesByRange(sales, range, startDate, endDate, now = new Date()) {
  if (range === "all") return sales;

  if (range === "24h") {
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return sales.filter((s) => {
      const t = new Date(`${s.date || "1970-01-01"}T${s.time || "00:00"}:00`);
      return !isNaN(t) && t > cutoff;
    });
  }

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 0;
  if (days > 0) {
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);
    return sales.filter((s) => {
      const d = new Date(`${s.date || "1970-01-01"}T00:00:00`);
      return !isNaN(d) && d >= cutoff;
    });
  }

  if (range === "custom") {
    if (!startDate || !endDate) return [];
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);
    return sales.filter((s) => {
      const d = new Date(`${s.date || "1970-01-01"}T00:00:00`);
      return !isNaN(d) && d >= start && d <= end;
    });
  }

  return sales;
}

export function groupSalesByDate(sales) {
  const map = {};
  sales.forEach((s) => {
    const d = s.date || "—";
    if (!map[d]) map[d] = { date: d, count: 0, volume: 0, amount: 0 };
    map[d].count += 1;
    map[d].volume += s.volume || 0;
    map[d].amount += s.amount || 0;
  });
  return Object.values(map).sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function computeRangeDates(range, now = new Date()) {
  if (range === "all" || range === "custom") return { startDate: "", endDate: "" };
  if (range === "24h") {
    const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return { startDate: start.toISOString().split("T")[0], endDate: now.toISOString().split("T")[0] };
  }
  const days = range === "7d" ? 7 : 30;
  const start = new Date(now);
  start.setDate(start.getDate() - days);
  return { startDate: start.toISOString().split("T")[0], endDate: now.toISOString().split("T")[0] };
}
