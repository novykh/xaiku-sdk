import os from 'os'
import process from 'process'

export default sdk => {
  let client = sdk.client
  let parentDestroy = client.destroy

  // Capture request-specific analytics (example using Express)
  client.captureRequestData = (req, res) => {
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

      client.setAttributes({
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

  client.setAttributes({
    userAgent: 'Node.js Server',
    environment: process.env.NODE_ENV || 'development',
    cpuUsage: os.cpus(),
    memoryUsage: process.memoryUsage(),
    serverUptime: process.uptime(),
    serverContext: serverContext(),
  })

  const handleUncaughtException = err => {
    console.error('Uncaught Exception:', err)
  }

  process.on('uncaughtException', handleUncaughtException)

  const handleUnhandledRejection = (reason, promise) => {
    console.error('Unhandled Rejection:', reason)
  }

  process.on('unhandledRejection', handleUnhandledRejection)

  // Add other Node.js-specific proxies or performance monitoring mechanisms as needed
  // For example, you could track DB query times, network requests, etc.

  client.destroy = () => {
    process.off('uncaughtException', handleUncaughtException)
    process.off('unhandledRejection', handleUnhandledRejection)
    parentDestroy()
    client = null
    parentDestroy = null
  }

  return client
}
