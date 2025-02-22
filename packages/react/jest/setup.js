global.fetch = require('jest-fetch-mock')

global.PerformanceObserver = class {
  constructor(callback) {
    this.callback = callback
  }
  observe() {
    // Mock implementation
    console.log('PerformanceObserver.observe() called')
  }
  disconnect() {
    console.log('PerformanceObserver.disconnect() called')
  }
}

global.PerformanceObserver.supportedEntryTypes = [
  'element',
  'event',
  'first-input',
  'largest-contentful-paint',
  'layout-shift',
  'longtask',
  'mark',
  'measure',
  'navigation',
  'paint',
  'resource',
]
