import withRenderGuard from "@/helpers/withRenderGuard"
import makeEventHandler from "@/client/makeEventHandler"

export default sdk => {
  let backForwardCacheRestoreTime = -1

  const getBackForwardCacheRestoreTime = () => backForwardCacheRestoreTime

  let firstHiddenTime = Infinity

  const getFirstHiddenTime = () => firstHiddenTime

  const onVisibilityUpdate = event => {
    if (document.visibilityState !== "hidden" || firstHiddenTime !== Infinity) return

    firstHiddenTime = event?.type === "visibilitychange" ? event.timeStamp : 0

    removeEventListener("visibilitychange", onVisibilityUpdate, true)
    clearVisibilityUpdate?.()
  }

  const clearVisibilityUpdate = withRenderGuard(onVisibilityUpdate)
  self.addEventListener("visibilitychange", onVisibilityUpdate, true)

  self.addEventListener(
    "pageshow",
    event => {
      if (!event.persisted) return

      backForwardCacheRestoreTime = event.timeStamp
      sdk.trigger("BFCacheRestore", event)

      firstHiddenTime =
        document.visibilityState === "hidden" && !document.prerendering ? 0 : Infinity
    },
    true
  )

  let pageHidden = false
  const getPageHidden = () => pageHidden

  const onHiddenOrPageHide = event => {
    if (!event.type === "pagehide" && document.visibilityState !== "hidden") return
    pageHidden = true
    sdk.trigger("hide", event)
  }
  self.addEventListener("visibilitychange", onHiddenOrPageHide, true)
  self.addEventListener("pagehide", onHiddenOrPageHide, true)

  self.addEventListener("click", makeEventHandler(sdk, "click"), false)
  self.addEventListener("keypress", makeEventHandler(sdk, "click"), false)

  const destroy = () => {
    removeEventListener("visibilitychange", onVisibilityUpdate, true)
    clearVisibilityUpdate()
    removeEventListener("visibilitychange", onHiddenOrPageHide, true)
    removeEventListener("pagehide", onHiddenOrPageHide, true)
  }

  return {
    getBackForwardCacheRestoreTime,
    getFirstHiddenTime,
    getPageHidden,
    destroy,
  }
}
