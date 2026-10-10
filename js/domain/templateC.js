/**
 * Template C: Dynamic Lab Weekly CIE Domain Logic (CBIT IT Dept Standard)
 * Components per week:
 * - PEP: Pre-Experiment Preparation (Max 5 M)
 * - EXP: Experimentation during Lab (Max 10 M)
 * - PEA: Post-Experiment Analysis (Max 5 M)
 * - Rec: Record (Max 5 M)
 * - Cond: Conduct (Max 5 M)
 * - Total per week: 30 M
 * - Aggregate: Average across completed weeks
 */

export function calculateWeeklyTotal(entry) {
  if (
    entry.pep === null ||
    entry.exp === null ||
    entry.pea === null ||
    entry.rec === null ||
    entry.cond === null
  ) {
    return null
  }
  return Number((entry.pep + entry.exp + entry.pea + entry.rec + entry.cond).toFixed(1))
}

export function calculateLabCIEAggregate(weeks) {
  const totals = weeks
    .map(w => calculateWeeklyTotal(w))
    .filter(t => t !== null)
  if (totals.length === 0) return null
  const sum = totals.reduce((a, b) => a + b, 0)
  return Number((sum / totals.length).toFixed(1))
}

export function validateFieldC(field, val) {
  if (val === null || val === undefined) return null
  const maxes = {
    pep: 5,
    exp: 10,
    pea: 5,
    rec: 5,
    cond: 5,
  }
  const max = maxes[field] ?? 10
  if (val < 0 || val > max) {
    return `Max ${max}`
  }
  return null
}
