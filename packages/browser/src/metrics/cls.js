import makeMetric from "./metric"

// [CLS](https://web.dev/cls/) - Cumulative Layout Shift

export default (sdk, options = {}) => {
  const metric = makeMetric(sdk, "cls", options)

  sdk.on("layout-shift:list", entries => {
    metric.init({
      type: "timeseries",
      context: "browser.web_performance.web_vitals",
      group: "web_performance",
      title: "Web performance core metrics",
    })

    entries.forEach(entry => {
      if (entry.hadRecentInput) return

      const firstSessionEntry = metric.entries[0]
      const lastSessionEntry = metric.entries[metric.entries.length - 1]

      if (
        lastSessionEntry &&
        firstSessionEntry &&
        entry.startTime - lastSessionEntry.startTime < 1000 &&
        entry.startTime - firstSessionEntry.startTime < 5000
      ) {
        metric.setAttributes({
          value: (metric.value || 0) + entry.value,
          entries: [...metric.entries, entry],
        })
      } else {
        metric.setAttributes({
          value: (metric.value || 0) + entry.value,
          entries: [...metric.entries, entry],
        })
      }

      if (entry.value) metric.report()
    })

    metric.report({ force: true })
  })

  sdk.on("BFCacheRestore", () => {
    metric.init({ value: 0 })

    metric.report({ force: true })
  })
}
