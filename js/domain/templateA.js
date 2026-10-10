/**
 * Template A: Theory CIE Domain Logic (CBIT IT Dept Standard)
 * Components:
 * - ACT: Average of Class Tests (Max 20 M), absent treated as 0 in divisor 2, rounded
 * - AAss: Average of Assignments (Max 10 M)
 * - AST: Average of Best 2 of 3 Slip Tests (Max 5 M), rounded
 * - ATT: Attendance Score (Max 5 M)
 * - Total CIE: ACT + AAss + AST + ATT (Max 40 M)
 */

export function calculateACT(ct1, ct2) {
  if (ct1 === null && ct2 === null) return null
  const v1 = ct1 ?? 0
  const v2 = ct2 ?? 0
  return Math.round((v1 + v2) / 2)
}

export function calculateAAss(ass1, ass2) {
  if (ass1 === null && ass2 === null) return null
  const v1 = ass1 ?? 0
  const v2 = ass2 ?? 0
  return Number(((v1 + v2) / 2).toFixed(1))
}

export function calculateAST(st1, st2, st3) {
  if (st1 === null && st2 === null && st3 === null) return null
  const scores = [st1 ?? 0, st2 ?? 0, st3 ?? 0].sort((a, b) => b - a)
  const top2Avg = (scores[0] + scores[1]) / 2
  return Math.round(top2Avg)
}

export function calculateTemplateATotal(row) {
  const act = calculateACT(row.ct1, row.ct2)
  const aass = calculateAAss(row.ass1, row.ass2)
  const ast = calculateAST(row.st1, row.st2, row.st3)
  const att = row.att ?? null

  const hasAnyMissing =
    row.ct1 === null ||
    row.ct2 === null ||
    row.ass1 === null ||
    row.ass2 === null ||
    (row.st1 === null && row.st2 === null && row.st3 === null) ||
    row.att === null

  let total = null
  if (act !== null && aass !== null && ast !== null && att !== null) {
    total = Math.round(act + aass + ast + att)
  }

  return { act, aass, ast, att, total, isPending: hasAnyMissing }
}

export function validateFieldA(field, val) {
  if (val === null || val === undefined) return null
  const maxes = {
    ct1: 20,
    ct2: 20,
    ass1: 10,
    ass2: 10,
    st1: 5,
    st2: 5,
    st3: 5,
    att: 5,
  }
  const max = maxes[field] ?? 100
  if (val < 0 || val > max) {
    return `Max ${max}`
  }
  return null
}
