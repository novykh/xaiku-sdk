export default sdk => {
  let attributes = {
    framework: sdk.options.framework,
    frameworkVersion: sdk.options.frameworkVersion,
    sessionId: sdk.options.guid || sdk.guid || '',
    userId: sdk.options.userId || '',
    orgId: sdk.options.orgId || '',
  }

  const getAttribute = key => attributes[key]

  const getAttributes = () => attributes

  const setAttribute = (key, value) =>
    (attributes[key] = typeof value === 'function' ? value(attributes[key]) : value)

  const setAttributes = values => Object.keys(values).forEach(key => setAttribute(key, values[key]))

  const destroy = () => (attributes = null)

  return {
    getAttribute,
    getAttributes,
    setAttribute,
    setAttributes,
    destroy,
  }
}
