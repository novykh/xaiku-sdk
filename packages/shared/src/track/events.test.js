import makeListeners from '~/listeners'
import makeStorage from '~/storage'
import makeExperiments from '~/experiments'
import makeEvents from './events'

describe('track events', () => {
  let events
  let reports
  let sdk

  beforeEach(async () => {
    sdk = {
      options: {
        store: { name: 'memory' },
        skipExperiments: true,
        variants: { e1: { selected: { id: 'v1' } } },
      },
      ...makeListeners(),
    }
    sdk.storage = makeStorage(sdk)
    await makeExperiments(sdk)
    reports = []
    sdk.on('metric:report', (name, metric) => reports.push([name, metric]))
    events = makeEvents(sdk)
  })

  it('trackView sends an impression with the selected variant', () => {
    expect(events.trackView({ experimentId: 'e1' })).toBe(true)
    expect(reports).toEqual([['impression', { experimentId: 'e1', variantId: 'v1' }]])
  })

  it('trackView sends nothing when no variant is selected', () => {
    expect(events.trackView({ experimentId: 'e2' })).toBe(false)
    expect(reports).toEqual([])
  })

  it('trackView ignores a version that was only stored by an earlier page load', async () => {
    const fresh = {
      options: { store: { name: 'memory' }, skipExperiments: true },
      ...makeListeners(),
    }
    fresh.storage = makeStorage(fresh)
    await makeExperiments(fresh)
    fresh.storage.set('__xaiku__variants__', { e3: { selected: { id: 'old' } } })
    fresh.on('metric:report', (name, metric) => reports.push([name, metric]))

    expect(makeEvents(fresh).trackView({ experimentId: 'e3' })).toBe(false)
    expect(reports).toEqual([])
    fresh.storage.delete('__xaiku__variants__')
  })

  it('trackView keeps an explicit variantId and partId', () => {
    events.trackView({ experimentId: 'e1', variantId: 'v9', partId: 'headline' })
    expect(reports[0][1]).toEqual({ experimentId: 'e1', variantId: 'v9', partId: 'headline' })
  })

  it('trackClick fills in the selected variant', () => {
    events.trackClick({ experimentId: 'e1', partId: 'cta' })
    expect(reports).toEqual([['click', { experimentId: 'e1', variantId: 'v1', partId: 'cta' }]])
  })

  it('trackConversion omits variantId instead of sending null', () => {
    events.trackConversion({ experimentId: 'e2', variantId: null })
    expect(reports).toEqual([['conversion', { experimentId: 'e2' }]])
  })
})
