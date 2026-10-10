/**
 * Academic Analytics Engine
 * Calculates class-level insights for faculty:
 * - Average CIE
 * - Highest score
 * - Pass rate (>= 40% of 40 = 16)
 * - Academic risk count
 */
import { calculateTemplateATotal } from './templateA.js'

export function computeClassAnalytics(roster) {
  let totalSum = 0
  let countWithTotal = 0
  let highest = 0
  let passCount = 0
  let riskCount = 0

  roster.forEach(student => {
    const calc = calculateTemplateATotal(student)
    if (calc.total !== null) {
      totalSum += calc.total
      countWithTotal++
      if (calc.total > highest) highest = calc.total
      if (calc.total >= 16) passCount++
      if (calc.total < 16 || (student.att !== null && student.att < 3)) {
        riskCount++
      }
    }
  })

  const average = countWithTotal > 0 ? (totalSum / countWithTotal).toFixed(1) : '—'
  const passRate = countWithTotal > 0 ? Math.round((passCount / countWithTotal) * 100) : 0

  return {
    average,
    highest: highest || '—',
    passRate: `${passRate}%`,
    riskCount,
    totalStudents: roster.length
  }
}
