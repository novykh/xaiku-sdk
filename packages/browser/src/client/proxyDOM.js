import makeEventHandler from './makeEventHandler'

const counterSymbol = Symbol('XAIKU@counter')

const hasSupport = () => self && 'document' in self

const domInterfaces = ['EventTarget', 'Node']

export default (sdk, options) => {
  if (!hasSupport()) return

  const eventHandler = makeEventHandler(sdk, 'dom-event', options)

  // After hooking into click and keypress events bubbled up to `document`, we also hook into user-handled
  // clicks & keypresses, by adding an event listener of our own to any element to which they add a listener. That
  // way, whenever one of their handlers is triggered, ours will be, too. (This is needed because their handler
  // could potentially prevent the event from bubbling up to our global listeners. This way, our handler are still
  // guaranteed to fire at least once.)

  domInterfaces.forEach(mainTarget => {
    const proto = self[mainTarget] && self[mainTarget].prototype

    if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty('addEventListener')) return
    if (sdk.canProxyFn(proto.addEventListener)) return

    proto.addEventListener[sdk.xaikuFnSymbol] = proto.addEventListener

    const proxiedAddEventListener = new Proxy(proto.addEventListener, {
      apply: (target, thisArg, args) => {
        const [type, listener, optionsOrUseCapture] = args

        target[counterSymbol] ?? {}

        try {
          if (!target[counterSymbol][type] || target[counterSymbol][type] < 1) {
            target[counterSymbol][type]++
            return
          } else {
            target[counterSymbol][type] = 1
            target.apply(thisArg, [type, eventHandler, optionsOrUseCapture])
          }
        } catch (e) {
          // Do nothing
        }

        return target.apply(thisArg, [type, listener, optionsOrUseCapture])
      },
    })

    if (self) self[mainTarget].prototype = proxiedAddEventListener

    const proxiedRemoveEventListener = new Proxy(proto.removeEventListener, {
      apply: (target, thisArg, args) => {
        if (!target[counterSymbol]) return

        const [type, listener, optionsOrUseCapture] = args

        try {
          if (target[counterSymbol][type] > 0) {
            target[counterSymbol][type]--
          } else {
            delete target[counterSymbol]
            target.apply(thisArg, [type, eventHandler, optionsOrUseCapture])
          }
        } catch (e) {
          // Do nothing
        }

        return target.apply(thisArg, [type, listener, optionsOrUseCapture])
      },
    })

    if (self) self[mainTarget].prototype = proxiedRemoveEventListener
  })
}
