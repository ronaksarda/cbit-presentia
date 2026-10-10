/**
 * Academic Report & Export Service
 * Exports Theory & Lab CIE rosters to CSV and JSON formats
 */
import { calculateTemplateATotal } from '../domain/templateA.js'

export function exportRosterToCSV(roster, courseName = '22ITC20N_Theory_CIE') {
  const headers = [
    'S.No', 'Roll No', 'Name', 
    'CT1 (20)', 'CT2 (20)', 'ACT (20)',
    'Ass1 (10)', 'Ass2 (10)', 'AAss (10)',
    'ST1 (5)', 'ST2 (5)', 'ST3 (5)', 'AST (5)',
    'ATT (5)', 'Total CIE (40)'
  ]

  const rows = roster.map(s => {
    const calc = calculateTemplateATotal(s)
    return [
      s.sNo,
      `"${s.rollNo}"`,
      `"${s.name}"`,
      s.ct1 !== null ? s.ct1 : 'AB',
      s.ct2 !== null ? s.ct2 : 'AB',
      calc.act !== null ? calc.act : '—',
      s.ass1 !== null ? s.ass1 : 'AB',
      s.ass2 !== null ? s.ass2 : 'AB',
      calc.aass !== null ? calc.aass : '—',
      s.st1 !== null ? s.st1 : 'AB',
      s.st2 !== null ? s.st2 : 'AB',
      s.st3 !== null ? s.st3 : 'AB',
      calc.ast !== null ? calc.ast : '—',
      s.att !== null ? s.att : '—',
      calc.total !== null ? calc.total : 'Pending'
    ]
  })

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${courseName}_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportRosterToJSON(roster, courseName = '22ITC20N_Theory_CIE') {
  const exportData = roster.map(s => ({
    ...s,
    calculated: calculateTemplateATotal(s)
  }))
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${courseName}_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
