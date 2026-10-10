/**
 * Praesentia — Main Application Entry Point
 * 100% Vanilla ES Modules, zero React/TypeScript runtime dependencies
 */
import { store } from './state/store.js'
import { INITIAL_STUDENT, INITIAL_FACULTY } from './data/initialData.js'
import { renderStudentView } from './ui/studentView.js'
import { renderFacultyView } from './ui/facultyView.js'
import { setupModals } from './ui/modal.js'
import { showToast } from './ui/toast.js'

// DOM References
const viewLanding = document.getElementById('view-landing')
const viewStudent = document.getElementById('view-student')
const viewFaculty = document.getElementById('view-faculty')
const userControls = document.getElementById('user-controls')
const userDisplayName = document.getElementById('user-display-name')
const userDisplayRole = document.getElementById('user-display-role')
const btnLogout = document.getElementById('btn-logout')

// Tab Switcher on Landing
const tabStudent = document.getElementById('tab-student')
const tabFaculty = document.getElementById('tab-faculty')
const formStudent = document.getElementById('form-student-login')
const formFaculty = document.getElementById('form-faculty-login')

tabStudent.addEventListener('click', () => {
  tabStudent.classList.add('active')
  tabFaculty.classList.remove('active')
  formStudent.classList.add('active')
  formFaculty.classList.remove('active')
})

tabFaculty.addEventListener('click', () => {
  tabFaculty.classList.add('active')
  tabStudent.classList.remove('active')
  formFaculty.classList.add('active')
  formStudent.classList.remove('active')
})

// Authentication Handlers
formStudent.addEventListener('submit', (e) => {
  e.preventDefault()
  const roll = document.getElementById('student-roll').value.trim()
  store.currentUser = { role: 'student', data: { ...INITIAL_STUDENT, rollNo: roll } }
  navigateTo('student')
  showToast(`Welcome back, ${store.currentUser.data.name}!`, 'success')
})

formFaculty.addEventListener('submit', (e) => {
  e.preventDefault()
  store.currentUser = { role: 'faculty', data: INITIAL_FACULTY }
  navigateTo('faculty')
  showToast(`Authenticated as ${store.currentUser.data.name}`, 'success')
})

btnLogout.addEventListener('click', () => {
  store.currentUser = null
  navigateTo('landing')
  showToast('Signed out securely.', 'success')
})

// View Routing
export function navigateTo(viewName) {
  viewLanding.classList.remove('active')
  viewStudent.classList.remove('active')
  viewFaculty.classList.remove('active')

  if (viewName === 'landing') {
    viewLanding.classList.add('active')
    userControls.classList.add('hidden')
  } else if (viewName === 'student') {
    viewStudent.classList.add('active')
    userControls.classList.remove('hidden')
    userDisplayName.textContent = store.currentUser.data.name
    userDisplayRole.textContent = `Student (${store.currentUser.data.sec})`
    renderStudentView()
  } else if (viewName === 'faculty') {
    viewFaculty.classList.add('active')
    userControls.classList.remove('hidden')
    userDisplayName.textContent = store.currentUser.data.name
    userDisplayRole.textContent = 'Authorized Faculty'
    renderFacultyView()
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupModals()
  navigateTo('landing')
  console.log('✓ Praesentia production modular app initialized.')
})
