/**
 * Toast Notification System
 */

let toastContainer = null

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.className = 'toast-container'
    document.body.appendChild(toastContainer)
  }
}

export function showToast(message, type = 'success') {
  ensureContainer()
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  
  const icon = type === 'success' 
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `
  toastContainer.appendChild(toast)

  setTimeout(() => {
    toast.classList.add('fade-out')
    setTimeout(() => toast.remove(), 250)
  }, 2800)
}
