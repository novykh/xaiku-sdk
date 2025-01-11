// export function wrapTimer(sharedEE) {
//   const ee = scopedEE(sharedEE)
//   if (wrapped[ee.debugId]) return ee
//   wrapped[ee.debugId] = true
//   var wrapFn = wfn(ee)

//   var SET_TIMEOUT = "setTimeout"
//   var SET_INTERVAL = "setInterval"
//   var CLEAR_TIMEOUT = "clearTimeout"
//   var START = "-start"
//   var DASH = "-"

//   wrapFn.inPlace(self, [SET_TIMEOUT, "setImmediate"], SET_TIMEOUT + DASH)
//   wrapFn.inPlace(self, [SET_INTERVAL], SET_INTERVAL + DASH)
//   wrapFn.inPlace(self, [CLEAR_TIMEOUT, "clearImmediate"], CLEAR_TIMEOUT + DASH)

//   ee.on(SET_INTERVAL + START, interval)
//   ee.on(SET_TIMEOUT + START, timer)

//   function interval(args, obj, type) {
//     args[0] = wrapFn(args[0], "fn-", null, type)
//   }

//   function timer(args, obj, type) {
//     this.method = type
//     this.timerDuration = isNaN(args[1]) ? 0 : +args[1]
//     args[0] = wrapFn(args[0], "fn-", this, type)
//   }

//   return ee
// }

export default sdk => {
  sdk.proxy(self, ['setTimeout', 'clearTimeout', 'setInterval', 'setImmediate', 'clearImmediate'])
  sdk.proxy(self, 'setInterval')

  const timerCallback = (args, fnName) => {
    args[0] = sdk.proxyFn(args[0].name || 'anonymous', args[0], undefined, fnName)
  }
  sdk.on('setTimeout-start', timerCallback)
}
