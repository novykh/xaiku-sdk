import { assignRef, mergeRefs } from '~/mergeRefs'

describe('assignRef', () => {
  it('should assign value to a function ref', () => {
    const ref = jest.fn()
    const value = 'testValue'
    assignRef(ref, value)
    expect(ref).toHaveBeenCalledWith(value)
  })

  it('should assign value to an object ref', () => {
    const ref = { current: null }
    const value = 'testValue'
    assignRef(ref, value)
    expect(ref.current).toBe(value)
  })

  it('should throw an error if ref is not a function or object', () => {
    const ref = 'invalidRef'
    const value = 'testValue'
    expect(() => assignRef(ref, value)).toThrow(`Cannot assign value '${value}' to ref '${ref}'`)
  })

  it('should do nothing if ref is null or undefined', () => {
    expect(() => assignRef(null, 'testValue')).not.toThrow()
    expect(() => assignRef(undefined, 'testValue')).not.toThrow()
  })
})

describe('mergeRefs', () => {
  it('should call assignRef for each ref', () => {
    const ref1 = jest.fn()
    const ref2 = { current: null }
    const node = 'testNode'
    const mergedRef = mergeRefs(ref1, ref2)
    mergedRef(node)
    expect(ref1).toHaveBeenCalledWith(node)
    expect(ref2.current).toBe(node)
  })

  it('should handle multiple refs correctly', () => {
    const ref1 = jest.fn()
    const ref2 = { current: null }
    const ref3 = jest.fn()
    const node = 'testNode'
    const mergedRef = mergeRefs(ref1, ref2, ref3)
    mergedRef(node)
    expect(ref1).toHaveBeenCalledWith(node)
    expect(ref2.current).toBe(node)
    expect(ref3).toHaveBeenCalledWith(node)
  })
})
