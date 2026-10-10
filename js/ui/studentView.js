/**
 * Student Dashboard View Renderer
 */
import { store } from '../state/store.js'
import { calculateTemplateATotal } from '../domain/templateA.js'
import { calculateWeeklyTotal, calculateLabCIEAggregate } from '../domain/templateC.js'

export function renderStudentView() {
  const studentRoll = store.currentUser?.data?.rollNo || '160125737071'
  const studentTheory = store.roster.find(r => r.rollNo === studentRoll) || store.roster[0]

  document.getElementById('student-name-header').textContent = studentTheory.name
  document.getElementById('student-roll-badge').textContent = studentTheory.rollNo

  // 1. Calculate & Render Theory CIE
  const theoryCalc = calculateTemplateATotal(studentTheory)
  const theoryTotalEl = document.getElementById('stu-theory-total')
  const theoryStatusEl = document.getElementById('stu-theory-status')

  if (theoryCalc.total !== null) {
    theoryTotalEl.innerHTML = `${theoryCalc.total}<span class="score-denom"> / 40 M</span>`
    theoryStatusEl.className = 'score-status verified'
    theoryStatusEl.innerHTML = `<span class="indicator-dot dot-emerald"></span> Verified CIE`
  } else {
    theoryTotalEl.innerHTML = `Pending<span class="score-denom"> / 40 M</span>`
    theoryStatusEl.className = 'score-status pending'
    theoryStatusEl.innerHTML = `<span class="indicator-dot dot-amber"></span> Pending Marks`
  }

  // Component breakdown boxes
  document.getElementById('stu-act-val').innerHTML = `${theoryCalc.act ?? '—'} <span class="comp-max">/ 20</span>`
  document.getElementById('stu-ct-hint').textContent = `CT1: ${studentTheory.ct1 ?? 'AB'} | CT2: ${studentTheory.ct2 ?? 'AB'}`

  document.getElementById('stu-aass-val').innerHTML = `${theoryCalc.aass ?? '—'} <span class="comp-max">/ 10</span>`
  document.getElementById('stu-ass-hint').textContent = `Ass-1: ${studentTheory.ass1 ?? 'AB'} | Ass-2: ${studentTheory.ass2 ?? 'AB'}`

  document.getElementById('stu-ast-val').innerHTML = `${theoryCalc.ast ?? '—'} <span class="comp-max">/ 5</span>`
  document.getElementById('stu-att-val').innerHTML = `${theoryCalc.att ?? '—'} <span class="comp-max">/ 5</span>`

  // 2. Calculate & Render Lab CIE
  const labWeeksForStudent = store.labWeeks.map(w => {
    const entry = w.entries.find(e => e.rollNo === studentRoll) || { pep: null, exp: null, pea: null, rec: null, cond: null }
    return {
      weekNumber: w.weekNumber,
      date: w.date,
      ...entry,
      total: calculateWeeklyTotal(entry),
    }
  })

  const labAggregate = calculateLabCIEAggregate(labWeeksForStudent)
  const labTotalEl = document.getElementById('stu-lab-total')
  if (labAggregate !== null) {
    labTotalEl.innerHTML = `${labAggregate}<span class="score-denom"> / 30 M</span>`
  } else {
    labTotalEl.innerHTML = `—<span class="score-denom"> / 30 M</span>`
  }

  const stuLabTableBody = document.getElementById('stu-lab-table-body')
  stuLabTableBody.innerHTML = ''
  labWeeksForStudent.forEach(w => {
    const tr = document.createElement('tr')
    const isComplete = w.total !== null
    tr.innerHTML = `
      <td class="font-medium text-white">
        <div class="week-title-cell">
          <span class="week-tag">W${w.weekNumber}</span>
          <span class="week-date">${w.date}</span>
        </div>
      </td>
      <td><span class="score-pill">${w.pep ?? '—'}</span></td>
      <td><span class="score-pill">${w.exp ?? '—'}</span></td>
      <td><span class="score-pill">${w.pea ?? '—'}</span></td>
      <td><span class="score-pill">${w.rec ?? '—'}</span></td>
      <td><span class="score-pill">${w.cond ?? '—'}</span></td>
      <td class="text-right">
        <span class="score-total-badge ${isComplete ? 'total-complete' : 'total-incomplete'}">
          ${w.total ?? 'Incomplete'}
        </span>
      </td>
    `
    stuLabTableBody.appendChild(tr)
  })
}
