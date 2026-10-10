/**
 * Reusable Modal UI Utility
 */
import { store } from '../state/store.js'
import { supabaseService } from '../services/supabase.js'
import { showToast } from './toast.js'
import { renderTemplateATable, renderTemplateCTable } from './facultyView.js'

export function setupModals() {
  const modalBackdrop = document.getElementById('modal-backdrop')
  const modalTitle = document.getElementById('modal-title')
  const modalBody = document.getElementById('modal-body')
  const modalFooter = document.getElementById('modal-footer')
  const modalClose = document.getElementById('modal-close')

  function closeModal() {
    modalBackdrop.classList.remove('active')
  }

  modalClose.addEventListener('click', closeModal)
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal()
  })

  // Open Student Discrepancy Modal
  document.getElementById('btn-student-discrepancy')?.addEventListener('click', () => {
    modalTitle.textContent = 'Submit CIE Discrepancy Query'
    modalBody.innerHTML = `
      <p class="text-dim" style="font-size: 0.8rem; margin-bottom: 0.5rem;">
        If you notice an unverified or mismatched mark in Class Tests, Assignments, or Slip Tests, submit your formal remark to the Course Coordinator.
      </p>
      <div class="form-group">
        <label>Subject</label>
        <select id="disc-subject" class="form-select" style="width: 100%;">
          <option value="22ITC20N">Data Structures using C++ (22ITC20N)</option>
          <option value="22ITC21N">Data Structures Lab (22ITC21N)</option>
        </select>
      </div>
      <div class="form-group">
        <label>Component with Issue</label>
        <select id="disc-component" class="form-select" style="width: 100%;">
          <option value="CT1">Class Test 1</option>
          <option value="CT2">Class Test 2</option>
          <option value="AAss">Assignment Average</option>
          <option value="AST">Slip Test Average</option>
          <option value="ATT">Attendance Mark</option>
          <option value="LAB">Lab Weekly Score</option>
        </select>
      </div>
      <div class="form-group">
        <label>Detailed Note / Proof</label>
        <textarea id="disc-note" class="modal-textarea" placeholder="Explain the discrepancy (e.g., attended CT1 on 15-Aug, awarded 12 instead of 9)..." required></textarea>
      </div>
    `
    modalFooter.innerHTML = `
      <button class="btn btn-secondary btn-sm" id="btn-modal-cancel">Cancel</button>
      <button class="btn btn-primary btn-sm" id="btn-modal-submit-disc">Submit Query</button>
    `

    document.getElementById('btn-modal-cancel').addEventListener('click', closeModal)
    document.getElementById('btn-modal-submit-disc').addEventListener('click', async () => {
      const subject = document.getElementById('disc-subject').value
      const component = document.getElementById('disc-component').value
      const note = document.getElementById('disc-note').value.trim()
      if (!note) {
        showToast('Please provide a note explaining the discrepancy.', 'warning')
        return
      }

      await supabaseService.submitDiscrepancy({
        studentRoll: store.currentUser.data.rollNo,
        subject,
        component,
        note
      })

      closeModal()
      showToast('Discrepancy remark submitted to faculty.', 'success')
    })

    modalBackdrop.classList.add('active')
  })

  // Open Faculty Add Student Modal
  document.getElementById('btn-add-student')?.addEventListener('click', () => {
    modalTitle.textContent = 'Enroll Student in Section IT-1'
    modalBody.innerHTML = `
      <div class="form-group">
        <label>Roll Number (12 Digits)</label>
        <input type="text" id="new-stu-roll" class="form-input" placeholder="e.g. 160125737080" required>
      </div>
      <div class="form-group">
        <label>Student Full Name</label>
        <input type="text" id="new-stu-name" class="form-input" placeholder="e.g. Harini Reddy" required>
      </div>
      <div class="form-group">
        <label>Section & Semester</label>
        <input type="text" class="form-input" value="Section IT-1, Semester II" disabled>
      </div>
    `
    modalFooter.innerHTML = `
      <button class="btn btn-secondary btn-sm" id="btn-modal-cancel-stu">Cancel</button>
      <button class="btn btn-accent btn-sm" id="btn-modal-submit-stu">Enroll Student</button>
    `

    document.getElementById('btn-modal-cancel-stu').addEventListener('click', closeModal)
    document.getElementById('btn-modal-submit-stu').addEventListener('click', () => {
      const roll = document.getElementById('new-stu-roll').value.trim()
      const name = document.getElementById('new-stu-name').value.trim()

      if (!roll || !name) {
        showToast('Roll number and Name are required.', 'warning')
        return
      }

      if (store.roster.some(s => s.rollNo === roll)) {
        showToast('Student with this Roll Number is already enrolled.', 'warning')
        return
      }

      const newStudent = {
        sNo: store.roster.length + 1,
        rollNo: roll,
        name: name,
        ct1: null,
        ct2: null,
        ass1: null,
        ass2: null,
        st1: null,
        st2: null,
        st3: null,
        att: null
      }

      store.roster.push(newStudent)
      store.saveRoster()

      // Also add to each lab week
      store.labWeeks.forEach(w => {
        w.entries.push({
          rollNo: roll,
          pep: null,
          exp: null,
          pea: null,
          rec: null,
          cond: null
        })
      })
      store.saveLabWeeks()

      renderTemplateATable()
      renderTemplateCTable()
      closeModal()
      showToast(`Student ${name} successfully enrolled!`, 'success')
    })

    modalBackdrop.classList.add('active')
  })
}
