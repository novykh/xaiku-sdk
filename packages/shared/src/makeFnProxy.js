import { noop } from '~/helpers'

export const xaikuFn = Symbol('XAIKU@originalFn')
export const states = {
  start: 'start',
  end: 'end',
  error: 'error',
}

export default trigger => {
  const canProxyFn = fn => {
    return fn && fn instanceof Function && fn.apply && !fn[xaikuFn]
  }

  const proxyFn = (fnName, fn, callback = noop, context, obj) => {
    if (!canProxyFn(fn)) return fn

    const eventContext = context ? `${context}-${fnName}-` : `${fnName}-`

    fn[xaikuFn] = fn

    const proxied = new Proxy(fn, {
      apply: (target, thisArg, args) => {
        callback(args, fnName, obj, { thisArg, target })

        trigger(eventContext + states.start, args, fnName, obj)
        let result
        try {
          result = target.apply(thisArg, args)
          return result
        } catch (err) {
          trigger(eventContext + states.error, args, err)
        } finally {
          trigger(eventContext + states.end, args, result)
        }
      },
    })

    if (obj) obj[fnName] = proxied

    return proxied
  }

  return {
    canProxyFn,
    proxy: (obj, fnNames, callback, context) =>
      Array.isArray(fnNames)
        ? fnNames.forEach(fnName => proxyFn(fnName, obj[fnName], callback, context, obj))
        : proxyFn(fnNames, obj[fnNames], callback, context, obj),
    proxyFn,
    xaikuFnSymbol: xaikuFn,
    proxyStates: states,
  }
}
