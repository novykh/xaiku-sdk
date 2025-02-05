import isNode from '@/isNode'

describe('isNode', () => {
  let originalProcess

  beforeAll(() => {
    originalProcess = global.process
  })

  afterEach(() => {
    global.process = originalProcess
  })

  it('should return false when process is undefined', () => {
    global.process = undefined

    const result = isNode()

    expect(result).toBe(false)
  })

  it('should return false when versions is null', () => {
    global.process = { versions: null }

    const result = isNode()

    expect(result).toBe(false)
  })

  it('should return false when versions.node is null', () => {
    global.process = { versions: { node: null } }

    const result = isNode()

    expect(result).toBe(false)
  })

  it('should return true when process and node version are defined', () => {
    global.process = { versions: { node: 'v14.0.0' } }

    const result = isNode()

    expect(result).toBe(true)
  })
})
