/**
 * Supabase Academic Integration Service
 * Provides sync with Supabase PostgreSQL tables:
 * - `praesentia_roster` (Theory CIE records)
 * - `praesentia_lab_weeks` (Dynamic Lab Weekly CIE entries)
 * - `praesentia_discrepancies` (Student remarks/discrepancies)
 * 
 * Includes offline local storage fallback.
 */

export class SupabaseService {
  constructor() {
    this.url = window.SUPABASE_CONFIG?.url || 'https://demo-praesentia.supabase.co'
    this.anonKey = window.SUPABASE_CONFIG?.anonKey || 'demo-anon-key'
    this.isConnected = false
  }

  async testConnection() {
    try {
      if (!this.url || this.url.includes('demo-praesentia')) {
        this.isConnected = false
        return false
      }
      const res = await fetch(`${this.url}/rest/v1/`, {
        headers: { apikey: this.anonKey }
      })
      this.isConnected = res.ok
      return this.isConnected
    } catch {
      this.isConnected = false
      return false
    }
  }

  async syncRosterToServer(roster) {
    if (!this.isConnected) {
      // Local fallback
      localStorage.setItem('praesentia_roster', JSON.stringify(roster))
      return { success: true, mode: 'local' }
    }

    try {
      const response = await fetch(`${this.url}/rest/v1/praesentia_roster`, {
        method: 'POST',
        headers: {
          apikey: this.anonKey,
          Authorization: `Bearer ${this.anonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify(roster)
      })
      return { success: response.ok, mode: 'supabase' }
    } catch {
      localStorage.setItem('praesentia_roster', JSON.stringify(roster))
      return { success: true, mode: 'local-fallback' }
    }
  }

  async syncLabWeeksToServer(labWeeks) {
    if (!this.isConnected) {
      localStorage.setItem('praesentia_lab_weeks', JSON.stringify(labWeeks))
      return { success: true, mode: 'local' }
    }

    try {
      const response = await fetch(`${this.url}/rest/v1/praesentia_lab_weeks`, {
        method: 'POST',
        headers: {
          apikey: this.anonKey,
          Authorization: `Bearer ${this.anonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates'
        },
        body: JSON.stringify(labWeeks)
      })
      return { success: response.ok, mode: 'supabase' }
    } catch {
      localStorage.setItem('praesentia_lab_weeks', JSON.stringify(labWeeks))
      return { success: true, mode: 'local-fallback' }
    }
  }

  async submitDiscrepancy(data) {
    const existing = JSON.parse(localStorage.getItem('praesentia_discrepancies') || '[]')
    existing.push({
      id: 'disc_' + Date.now(),
      timestamp: new Date().toISOString(),
      ...data
    })
    localStorage.setItem('praesentia_discrepancies', JSON.stringify(existing))
    return { success: true }
  }
}

export const supabaseService = new SupabaseService()
