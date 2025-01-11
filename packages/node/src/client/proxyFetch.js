const hasSupport = () => {
  if (self?.chrome?.app?.runtime) return false

  return 'fetch' in self
}

const getMethod = (fetchArgs = []) => {
  if ('Request' in self && fetchArgs[0] instanceof Request && fetchArgs[0].method)
    return String(fetchArgs[0].method).toUpperCase()
  if (fetchArgs[1] && fetchArgs[1].method) return String(fetchArgs[1].method).toUpperCase()

  return 'GET'
}

const getUrl = fetchArgs => {
  if (typeof fetchArgs[0] === 'string') return fetchArgs[0]
  if ('Request' in self && fetchArgs[0] instanceof Request) return fetchArgs[0].url

  return String(fetchArgs[0])
}

export default sdk => {
  if (!hasSupport()) return
  if (sdk.canProxyFn(fetch)) return

  const eventContext = 'fetch-'

  fetch[sdk.xaikuFnSymbol] = fetch

  const proxied = new Proxy(fetch, {
    apply: (target, thisArg, args) => {
      const handlerData = {
        args,
        fetchData: {
          method: getMethod(args),
          url: getUrl(args),
        },
        startTimestamp: Date.now(),
      }

      sdk.trigger(
        eventContext + sdk.proxyStates.start,
        {
          ...handlerData,
        },
        'fetch',
        self
      )

      target
        .apply(self, args)
        .then(response => {
          sdk.trigger(
            eventContext + sdk.proxyStates.end,
            {
              ...handlerData,
              endTimestamp: Date.now(),
              response,
            },
            'fetch',
            self
          )

          return response
        })
        .catch(error => {
          sdk.trigger(
            eventContext + sdk.proxyStates.error,
            {
              ...handlerData,
              endTimestamp: Date.now(),
              error,
            },
            'fetch',
            self
          )

          throw error
        })
    },
  })

  if (self) self['fetch'] = proxied
}
