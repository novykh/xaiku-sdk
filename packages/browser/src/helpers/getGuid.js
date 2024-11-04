import { getCookie } from "./cookies"

let guid = null

export default () => {
  if (guid) return guid

  guid = getCookie("xaikuguid")

  if (guid) return guid

  guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

  document.cookie = `xaikuguid=${guid}`

  return guid
}
