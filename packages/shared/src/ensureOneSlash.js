export default urlStr =>
  typeof urlStr === 'string' ? urlStr.replace(/([^:]\/)\/+/g, '$1') : urlStr
