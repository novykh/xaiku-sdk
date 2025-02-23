// Do not forget to disconnect to avoid memory leaks: observer.disconnect()

export default (element, callback, { threshold = 0.5 }) => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        callback({ type: 'view-in-screen' })
        observer.unobserve(element)
      }
    },
    { threshold }
  )

  observer.observe(element)

  return observer
}
