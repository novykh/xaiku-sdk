export default sdk =>
  sdk.on("metric:init", metric => metric.mutate({ pathname: self.location.pathname }))
