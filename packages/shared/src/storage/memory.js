let attributes = {}

export const name = Symbol('XAIKU@memory')

export default () => {
  const store = {
    name,
    supported: true,
    get: name => attributes[name],
    set: (name, value) => (attributes[name] = value),
    delete: name => delete attributes[name],
  }

  return store
}
