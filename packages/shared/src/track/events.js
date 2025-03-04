export default sdk => {
  // 1. Impression: Track when a variant is shown.
  const trackView = (extraData = {}) => {
    sdk.trigger('metric:report', 'impression', extraData)
  }

  // 2. Click: Track when a variant is clicked.
  const trackClick = (extraData = {}) => {
    sdk.trigger('metric:report', 'click', extraData)
  }

  // 3. Dwell/Reading Time: Start/stop timer for how long a variant is in view.
  // Returns start/stop functions so you can control when timing begins and ends.
  const trackDwellTime = (extraData = {}) => {
    let startTime = null
    return {
      start: () => {
        startTime = Date.now()
      },
      stop: () => {
        if (startTime) {
          const duration = Date.now() - startTime
          sdk.trigger('metric:report', 'dwell_time', { ...extraData, timeOnPage: duration })
          startTime = null
        }
      },
    }
  }

  // 4. Scroll Depth: Track how far the user scrolls down the page.
  // This function listens to scroll events and flushes a "scroll_depth" event on beforeunload.
  const trackScrollDepth = (extraData = {}) => {
    let maxScroll = 0
    const onScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
      const winHeight = window.innerHeight
      const scrollPercent = Math.min((scrollTop / (docHeight - winHeight)) * 100, 100)
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
      }
    }

    window.addEventListener('scroll', onScroll)

    window.addEventListener('beforeunload', () => {
      sdk.trigger('metric:report', 'scroll_depth', { ...extraData, scrollDepth: maxScroll })
    })
  }

  /* ---------------------------------------------------------------------------
   Conversion & Behavioral Metrics
--------------------------------------------------------------------------- */

  // 5. Conversion: Capture actions such as form submissions or sign-ups.
  const trackConversion = (extraData = {}) => {
    sdk.trigger('metric:report', 'conversion', extraData)
  }

  // 6. Time-to-Conversion: Record the time interval from an initial impression to conversion.
  const trackTimeToConversion = (impressionTimestamp, extraData = {}) => {
    const timeDiff = Date.now() - new Date(impressionTimestamp).getTime()
    sdk.trigger('metric:report', 'time_to_conversion', { ...extraData, timeToConversion: timeDiff })
  }

  // 7. Bounce Rate: Detect if users leave quickly after viewing a variant.
  const trackBounce = (extraData = {}) => {
    const threshold = 5_000 // e.g., 5 seconds considered a bounce
    const startTime = Date.now()
    window.addEventListener('beforeunload', () => {
      const dwell = Date.now() - startTime
      if (dwell < threshold) {
        sdk.trigger('metric:report', 'bounce', { ...extraData, timeOnPage: dwell })
      }
    })
  }

  /* ---------------------------------------------------------------------------
   Interaction Quality Signals
--------------------------------------------------------------------------- */

  // 8. Hover/Mouse Tracking: Capture hover duration over a specific element.
  const trackHover = (element, extraData = {}) => {
    let hoverStart = null
    element.addEventListener('mouseenter', () => {
      hoverStart = Date.now()
    })
    element.addEventListener('mouseleave', () => {
      if (hoverStart) {
        const hoverDuration = Date.now() - hoverStart
        sdk.trigger('metric:report', 'hover', { ...extraData, hoverDuration })
        hoverStart = null
      }
    })
  }

  // 9. Feedback/Sentiment: Capture user feedback such as a rating.
  const trackFeedback = (rating, extraData = {}) => {
    sdk.trigger('metric:report', 'feedback', { ...extraData, rating })
  }

  /* ---------------------------------------------------------------------------
   Performance & Error Metrics
--------------------------------------------------------------------------- */

  // 10. Performance Metrics: Capture load times and interaction delays.
  const trackPerformanceMetrics = (extraData = {}) => {
    if (window.performance && window.performance.timing) {
      const { timing } = window.performance
      const loadTime = timing.loadEventEnd - timing.navigationStart
      sdk.trigger('metric:report', 'performance', { ...extraData, loadTime })
    }
  }

  // 11. Error Tracking: Capture JavaScript errors as events.
  const trackError = (error, extraData = {}) => {
    sdk.trigger('metric:report', 'error', {
      ...extraData,
      errorMessage: error.message,
      stack: error.stack,
    })
  }

  /* ---------------------------------------------------------------------------
   Advanced Distribution Metrics
--------------------------------------------------------------------------- */

  // 12. Numeric Metric Capture: Record raw numeric values (e.g., loadTime, interactionDelay)
  // This data can later be aggregated into histograms or statistical distributions on the backend.
  const trackNumericMetric = (metricName, value, extraData = {}) => {
    sdk.trigger('metric:report', metricName, { ...extraData, value })
  }

  // Export all functions for integration in your A/B testing SDK.
  return {
    trackView,
    trackClick,
    trackDwellTime,
    trackScrollDepth,
    trackConversion,
    trackTimeToConversion,
    trackBounce,
    trackHover,
    trackFeedback,
    trackPerformanceMetrics,
    trackError,
    trackNumericMetric,
  }
}
