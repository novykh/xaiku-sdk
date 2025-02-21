let attributes = {}

export default () => {
  const store = {
    name: Symbol('XAIKU@memory'),
    supported: true,
    get: name => attributes[name],
    set: (name, value) => (attributes[name] = value),
    delete: name => delete attributes[name],
  }

  return store
}
