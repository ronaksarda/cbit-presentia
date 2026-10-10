/**
 * Application State Store with LocalStorage Persistence
 */
import { INITIAL_STUDENT, INITIAL_FACULTY, INITIAL_ROSTER, INITIAL_LAB_WEEKS } from '../data/initialData.js'

class StateStore {
  constructor() {
    this.currentUser = null
    this.roster = this.load('praesentia_roster', INITIAL_ROSTER)
    this.labWeeks = this.load('praesentia_lab_weeks', INITIAL_LAB_WEEKS)
    this.activeWeekNumber = 1
    this.listeners = []
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : JSON.parse(JSON.stringify(fallback))
    } catch {
      return JSON.parse(JSON.stringify(fallback))
    }
  }

  saveRoster() {
    localStorage.setItem('praesentia_roster', JSON.stringify(this.roster))
    this.notify()
  }

  saveLabWeeks() {
    localStorage.setItem('praesentia_lab_weeks', JSON.stringify(this.labWeeks))
    this.notify()
  }

  resetToDefaults() {
    this.roster = JSON.parse(JSON.stringify(INITIAL_ROSTER))
    this.labWeeks = JSON.parse(JSON.stringify(INITIAL_LAB_WEEKS))
    this.saveRoster()
    this.saveLabWeeks()
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  notify() {
    this.listeners.forEach(l => l(this))
  }
}

export const store = new StateStore()
