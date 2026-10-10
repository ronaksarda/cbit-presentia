/**
 * Faculty Workspace View Renderer
 * Provides spreadsheet mark-entry for Template A & Template C with search, sorting, and analytics
 */
import { store } from '../state/store.js'
import { calculateTemplateATotal, validateFieldA } from '../domain/templateA.js'
import { calculateWeeklyTotal, validateFieldC } from '../domain/templateC.js'
import { computeClassAnalytics } from '../domain/analytics.js'
import { supabaseService } from '../services/supabase.js'
import { exportRosterToCSV, exportRosterToJSON } from '../services/exporter.js'
import { showToast } from './toast.js'

let searchTerm = ''

export function renderFacultyView() {
  updateAnalyticsBar()
  renderTemplateATable()
  renderTemplateCWeeks()
  setupEventListeners()
}

function updateAnalyticsBar() {
  const stats = computeClassAnalytics(store.roster)
  document.getElementById('stat-avg').textContent = stats.average
  document.getElementById('stat-high').textContent = stats.highest
  document.getElementById('stat-pass').textContent = stats.passRate
  document.getElementById('stat-risk').textContent = stats.riskCount
}

function parseMarkInput(val) {
  if (val === '' || val.toUpperCase() === 'AB') return null
  const num = parseFloat(val)
  return isNaN(num) ? null : num
}

export function renderTemplateATable() {
  const tbody = document.getElementById('tbody-template-a')
  if (!tbody) return
  tbody.innerHTML = ''

  const filteredRoster = store.roster.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNo.includes(searchTerm)
  )

  filteredRoster.forEach((student) => {
    const calc = calculateTemplateATotal(student)
    const tr = document.createElement('tr')
    tr.dataset.roll = student.rollNo

    tr.innerHTML = `
      <td class="col-sno">${student.sNo}</td>
      <td class="col-roll font-mono text-dim">${student.rollNo}</td>
      <td class="col-name font-semibold text-white">${student.name}</td>
      <td><input type="text" class="sheet-input" data-field="ct1" value="${student.ct1 !== null ? student.ct1 : 'AB'}"></td>
      <td><input type="text" class="sheet-input" data-field="ct2" value="${student.ct2 !== null ? student.ct2 : 'AB'}"></td>
      <td class="calc-cell cell-act">${calc.act ?? '—'}</td>
      <td><input type="text" class="sheet-input" data-field="ass1" value="${student.ass1 !== null ? student.ass1 : 'AB'}"></td>
      <td><input type="text" class="sheet-input" data-field="ass2" value="${student.ass2 !== null ? student.ass2 : 'AB'}"></td>
      <td class="calc-cell cell-aass">${calc.aass ?? '—'}</td>
      <td><input type="text" class="sheet-input" data-field="st1" value="${student.st1 !== null ? student.st1 : 'AB'}"></td>
      <td><input type="text" class="sheet-input" data-field="st2" value="${student.st2 !== null ? student.st2 : 'AB'}"></td>
      <td><input type="text" class="sheet-input" data-field="st3" value="${student.st3 !== null ? student.st3 : 'AB'}"></td>
      <td class="calc-cell cell-ast">${calc.ast ?? '—'}</td>
      <td><input type="text" class="sheet-input" data-field="att" value="${student.att !== null ? student.att : 'AB'}"></td>
      <td class="calc-cell total-cell cell-total">${calc.total !== null ? calc.total : '—'}</td>
    `
    tbody.appendChild(tr)
  })

  // Input listeners
  tbody.querySelectorAll('.sheet-input').forEach(input => {
    input.addEventListener('input', handleSheetInputA)
  })
}

function handleSheetInputA(e) {
  const input = e.target
  const field = input.dataset.field
  const tr = input.closest('tr')
  const rollNo = tr.dataset.roll
  const student = store.roster.find(s => s.rollNo === rollNo)
  if (!student) return

  const val = parseMarkInput(input.value)
  const error = validateFieldA(field, val)

  if (error) {
    input.classList.add('input-error')
    input.title = error
  } else {
    input.classList.remove('input-error')
    input.title = ''
  }

  student[field] = val

  // Recalculate row
  const calc = calculateTemplateATotal(student)
  tr.querySelector('.cell-act').textContent = calc.act ?? '—'
  tr.querySelector('.cell-aass').textContent = calc.aass ?? '—'
  tr.querySelector('.cell-ast').textContent = calc.ast ?? '—'
  tr.querySelector('.cell-total').textContent = calc.total ?? '—'

  // Update status and stats
  setSaveStatusA('unsaved')
  updateAnalyticsBar()
}

function setSaveStatusA(status) {
  const statusEl = document.getElementById('save-status-a')
  if (!statusEl) return
  if (status === 'saved') {
    statusEl.className = 'save-status-pill saved'
    statusEl.innerHTML = `<span class="indicator-dot dot-emerald"></span> All changes saved`
  } else {
    statusEl.className = 'save-status-pill unsaved'
    statusEl.innerHTML = `<span class="indicator-dot dot-amber"></span> Unsaved changes`
  }
}

// Template C Dynamic Lab Weeks
export function renderTemplateCWeeks() {
  const pillContainer = document.getElementById('week-pill-container')
  if (!pillContainer) return
  pillContainer.innerHTML = ''

  store.labWeeks.forEach(w => {
    const btn = document.createElement('button')
    btn.className = `week-pill ${w.weekNumber === store.activeWeekNumber ? 'active' : ''}`
    btn.textContent = `Week ${w.weekNumber} (${w.date})`
    btn.addEventListener('click', () => {
      store.activeWeekNumber = w.weekNumber
      renderTemplateCWeeks()
    })
    pillContainer.appendChild(btn)
  })

  renderTemplateCTable()
}

export function renderTemplateCTable() {
  const tbody = document.getElementById('tbody-template-c')
  if (!tbody) return
  tbody.innerHTML = ''

  const currentWeek = store.labWeeks.find(w => w.weekNumber === store.activeWeekNumber) || store.labWeeks[0]
  if (!currentWeek) return

  const filteredRoster = store.roster.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNo.includes(searchTerm)
  )

  filteredRoster.forEach((student) => {
    let entry = currentWeek.entries.find(e => e.rollNo === student.rollNo)
    if (!entry) {
      entry = { rollNo: student.rollNo, pep: null, exp: null, pea: null, rec: null, cond: null }
      currentWeek.entries.push(entry)
    }

    const total = calculateWeeklyTotal(entry)
    const tr = document.createElement('tr')
    tr.dataset.roll = student.rollNo

    tr.innerHTML = `
      <td class="col-sno">${student.sNo}</td>
      <td class="col-roll font-mono text-dim">${student.rollNo}</td>
      <td class="col-name font-semibold text-white">${student.name}</td>
      <td><input type="text" class="sheet-input lab-input" data-field="pep" value="${entry.pep ?? ''}"></td>
      <td><input type="text" class="sheet-input lab-input" data-field="exp" value="${entry.exp ?? ''}"></td>
      <td><input type="text" class="sheet-input lab-input" data-field="pea" value="${entry.pea ?? ''}"></td>
      <td><input type="text" class="sheet-input lab-input" data-field="rec" value="${entry.rec ?? ''}"></td>
      <td><input type="text" class="sheet-input lab-input" data-field="cond" value="${entry.cond ?? ''}"></td>
      <td class="calc-cell total-cell cell-week-total">${total !== null ? total : '—'}</td>
    `
    tbody.appendChild(tr)
  })

  tbody.querySelectorAll('.lab-input').forEach(input => {
    input.addEventListener('input', handleSheetInputC)
  })
}

function handleSheetInputC(e) {
  const input = e.target
  const field = input.dataset.field
  const tr = input.closest('tr')
  const rollNo = tr.dataset.roll

  const currentWeek = store.labWeeks.find(w => w.weekNumber === store.activeWeekNumber)
  const entry = currentWeek.entries.find(e => e.rollNo === rollNo)
  if (!entry) return

  const val = parseMarkInput(input.value)
  const error = validateFieldC(field, val)

  if (error) {
    input.classList.add('input-error')
    input.title = error
  } else {
    input.classList.remove('input-error')
    input.title = ''
  }

  entry[field] = val
  const total = calculateWeeklyTotal(entry)
  tr.querySelector('.cell-week-total').textContent = total !== null ? total : '—'

  setSaveStatusC('unsaved')
}

function setSaveStatusC(status) {
  const statusEl = document.getElementById('save-status-c')
  if (!statusEl) return
  if (status === 'saved') {
    statusEl.className = 'save-status-pill saved'
    statusEl.innerHTML = `<span class="indicator-dot dot-emerald"></span> All changes saved`
  } else {
    statusEl.className = 'save-status-pill unsaved'
    statusEl.innerHTML = `<span class="indicator-dot dot-amber"></span> Unsaved changes`
  }
}

// Global Event Listeners setup once
let listenersInitialized = false
function setupEventListeners() {
  if (listenersInitialized) return
  listenersInitialized = true

  // Search input
  const searchEl = document.getElementById('faculty-search-input')
  if (searchEl) {
    searchEl.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim()
      renderTemplateATable()
      renderTemplateCTable()
    })
  }

  // Course selector
  const courseSelect = document.getElementById('faculty-course-select')
  if (courseSelect) {
    courseSelect.addEventListener('change', (e) => {
      const panelA = document.getElementById('faculty-template-a')
      const panelC = document.getElementById('faculty-template-c')
      if (e.target.value === '22ITC20N') {
        panelA.classList.add('active')
        panelC.classList.remove('active')
      } else {
        panelC.classList.add('active')
        panelA.classList.remove('active')
      }
    })
  }

  // Save buttons
  document.getElementById('btn-save-a')?.addEventListener('click', async () => {
    store.saveRoster()
    await supabaseService.syncRosterToServer(store.roster)
    setSaveStatusA('saved')
    showToast('Theory marks saved successfully to database!', 'success')
  })

  document.getElementById('btn-save-c')?.addEventListener('click', async () => {
    store.saveLabWeeks()
    await supabaseService.syncLabWeeksToServer(store.labWeeks)
    setSaveStatusC('saved')
    showToast('Lab marks saved successfully to database!', 'success')
  })

  // Add lab week
  document.getElementById('btn-add-week')?.addEventListener('click', () => {
    const nextWeekNum = store.labWeeks.length + 1
    const today = new Date().toISOString().slice(0, 10).split('-').reverse().join('-')
    const newWeek = {
      weekNumber: nextWeekNum,
      date: today,
      entries: store.roster.map(s => ({
        rollNo: s.rollNo,
        pep: null,
        exp: null,
        pea: null,
        rec: null,
        cond: null
      }))
    }
    store.labWeeks.push(newWeek)
    store.activeWeekNumber = nextWeekNum
    store.saveLabWeeks()
    renderTemplateCWeeks()
    showToast(`Week ${nextWeekNum} added to Lab register!`, 'success')
  })

  // CSV Export
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    exportRosterToCSV(store.roster)
    showToast('Exported roster to CSV file.', 'success')
  })

  // JSON Export
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    exportRosterToJSON(store.roster)
    showToast('Exported roster to JSON file.', 'success')
  })

  // Print Report
  document.getElementById('btn-print-report')?.addEventListener('click', () => {
    window.print()
  })
}
