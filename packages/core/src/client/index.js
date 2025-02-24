export default sdk => {
  let attributes = {
    userId: sdk.options.userId,
    framework: sdk.options.framework,
    frameworkVersion: sdk.options.frameworkVersion,
  }

  const getAttribute = key => attributes[key]

  const getAttributes = () => attributes

  const setAttribute = (key, value) => {
    attributes[key] = typeof value === 'function' ? value(attributes[key]) : value
  }

  const setAttributes = values => {
    Object.keys(values).forEach(key => setAttribute(key, values[key]))
  }

  const destroy = () => {
    attributes = null
  }

  return {
    getAttribute,
    getAttributes,
    setAttribute,
    setAttributes,
    destroy,
  }
}
