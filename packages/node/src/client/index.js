import { getGuid } from '@xaiku/shared' // you can reuse shared utility functions
import os from 'os'
import process from 'process'

export default sdk => {
  let session = {
    guid: null,
    frameworks: [],
    userAgent: 'Node.js Server',
    environment: process.env.NODE_ENV || 'development',
    cpuUsage: os.cpus(),
    memoryUsage: process.memoryUsage(),
    serverUptime: process.uptime(),
  }

  const setAttribute = (key, value) => {
    session[key] = typeof value === 'function' ? value(session[key]) : value
  }

  const setAttributes = values => {
    Object.keys(values).forEach(key => setAttribute(key, values[key]))
  }

  // Server Context (for example, you might track the server's hostname, port, etc.)
  const serverContext = () => ({
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpuCount: os.cpus().length,
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    uptime: os.uptime(),
  })

  // Capture request-specific analytics (example using Express)
  const captureRequestData = (req, res) => {
    const start = process.hrtime()
    const requestData = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    }

    res.on('finish', () => {
      const [seconds, nanoseconds] = process.hrtime(start)
      const latency = seconds * 1000 + nanoseconds / 1e6 // in milliseconds

      setAttributes({
        requestLatency: latency,
        statusCode: res.statusCode,
        responseTime: latency,
      })

      // Optionally, log request data or send to an analytics service
      console.log('Request captured:', requestData)
      console.log('Response status:', res.statusCode)
      console.log('Response latency (ms):', latency)
    })
  }

  // Error handler to capture uncaught exceptions and unhandled rejections
  process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err)
    // Log to your monitoring system
  })

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason)
    // Log to your monitoring system
  })

  // Add other Node.js-specific proxies or performance monitoring mechanisms as needed
  // For example, you could track DB query times, network requests, etc.

  const destroy = () => {
    // Clean up resources here if necessary
    session = null
  }

  return {
    setAttribute,
    setAttributes,
    captureRequestData,
    destroy,
  }
}
