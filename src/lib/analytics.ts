// Simple Analytics System
// Tracks page views and user interactions locally

export interface AnalyticsEvent {
  type: 'page_view' | 'exercise_complete' | 'tab_change' | 'level_select'
  data?: Record<string, any>
  timestamp: number
}

class Analytics {
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private storageKey = 'speakup_analytics'

  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadFromStorage()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        this.events = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return
    try {
      // Keep only last 1000 events to prevent storage overflow
      const trimmedEvents = this.events.slice(-1000)
      localStorage.setItem(this.storageKey, JSON.stringify(trimmedEvents))
    } catch (error) {
      console.error('Failed to save analytics:', error)
    }
  }

  track(type: AnalyticsEvent['type'], data?: Record<string, any>) {
    const event: AnalyticsEvent = {
      type,
      data,
      timestamp: Date.now()
    }
    this.events.push(event)
    this.saveToStorage()

    // Log for debugging (in production, you'd send to analytics service)
    console.log('Analytics:', event)
  }

  getStats() {
    const pageViews = this.events.filter(e => e.type === 'page_view').length
    const exercisesCompleted = this.events.filter(e => e.type === 'exercise_complete').length
    const uniqueSessions = new Set(
      this.events.map(e => this.sessionId)
    ).size

    return {
      totalEvents: this.events.length,
      pageViews,
      exercisesCompleted,
      uniqueSessions,
      averageSessionDuration: this.calculateAvgSessionDuration()
    }
  }

  private calculateAvgSessionDuration(): number {
    const firstEvent = this.events[0]
    const lastEvent = this.events[this.events.length - 1]
    
    if (!firstEvent || !lastEvent) return 0
    
    const duration = (lastEvent.timestamp - firstEvent.timestamp) / 1000 // in seconds
    return Math.round(duration / 60) // in minutes
  }

  getEventsByType(type: AnalyticsEvent['type']) {
    return this.events.filter(e => e.type === type)
  }

  getRecentEvents(count: number = 10) {
    return this.events.slice(-count)
  }

  clearHistory() {
    this.events = []
    this.saveToStorage()
  }
}

// Export singleton instance
export const analytics = new Analytics()
