import selectVariant from './selectVariant'

describe('selectVariant (default export)', () => {
  test('should return one of the provided variants', () => {
    const variants = [
      { name: 'A', weight: 1 },
      { name: 'B', weight: 2 },
      { name: 'C', weight: 3 },
    ]
    const guid = 'user-guid'
    const projectId = 'project-xyz'
    const variant = selectVariant(variants, guid, projectId)
    const variantNames = variants.map(v => v.name)
    expect(variantNames).toContain(variant.selected.name)
    expect(variant.control).toBeUndefined()
  })

  test('should apply default weight of 5 if weight is undefined', () => {
    const variants = [
      { name: 'A', control: true }, // weight defaults to 5
      { name: 'B', weight: 2 },
    ]
    const projectId = 'project1'

    let variant = selectVariant(variants, 'guid1', projectId)
    expect(variant.selected.name).toEqual('A')
    expect(variant.control.name).toEqual('A')

    variant = selectVariant(variants, 'zzzzz', projectId)
    expect(variant.selected.name).toEqual('B')
    expect(variant.control.name).toEqual('A')
  })

  test('should consistently return the same variant for the same inputs', () => {
    const variants = [
      { name: 'A', weight: 10 },
      { name: 'B', weight: 20 },
    ]
    const guid = 'consistency-guid'
    const projectId = 'project-1'
    const variant1 = selectVariant(variants, guid, projectId)
    const variant2 = selectVariant(variants, guid, projectId)
    expect(variant1.selected.name).toEqual(variant2.selected.name)
  })
})
