import React from 'react'
import { render, waitFor } from '@testing-library/react'
import makeSdk from '@xaiku/browser'
import XaikuProvider from './provider'
import Experiment from './experiment'
import { Text } from './text'

const variantsFor = experimentId => ({
  experiments: {
    [experimentId]: [
      {
        id: 'v1',
        weight: 5,
        control: true,
        parts: { headline: 'Hi', body: 'Body', a: 'A', b: 'B', same: 'S' },
      },
    ],
  },
})

describe('views', () => {
  let sdk
  let reports

  const makeTestSdk = response => {
    fetch.mockResponseOnce(response)
    sdk = makeSdk({ pkey: 'pk_test_123', store: { name: 'memory' }, skipClient: true })
    reports = []
    sdk.on('metric:report', (name, metric) => reports.push({ name, ...metric }))
  }

  const experimentViews = () =>
    reports
      .filter(r => r.name === 'impression' && !r.partId)
      .map(({ name, experimentId, variantId }) => ({ name, experimentId, variantId }))
  const partViews = () => reports.filter(r => r.name === 'impression' && r.partId)

  afterEach(() => {
    sdk.destroy()
    sdk.storage.delete('__xaiku__experiments__')
    sdk.storage.delete('__xaiku__variants__')
  })

  it('Experiment sends one view for the experiment and one per part once the variant is selected', async () => {
    makeTestSdk(JSON.stringify(variantsFor('e1')))
    render(
      <XaikuProvider sdk={sdk}>
        <Experiment id="e1">
          <Text id="headline" fallback="Hi" />
          <Text id="body" fallback="Body" />
        </Experiment>
      </XaikuProvider>
    )

    await waitFor(() =>
      expect(experimentViews()).toEqual([
        { name: 'impression', experimentId: 'e1', variantId: 'v1' },
      ])
    )
    await waitFor(() => expect(partViews().map(r => r.partId)).toEqual(['headline', 'body']))
  })

  it('Text without an Experiment wrapper sends the experiment view once', async () => {
    makeTestSdk(JSON.stringify(variantsFor('e2')))
    render(
      <XaikuProvider sdk={sdk}>
        <Text experimentId="e2" id="a" fallback="A" />
        <Text experimentId="e2" id="b" fallback="B" />
      </XaikuProvider>
    )

    await waitFor(() => expect(partViews()).toHaveLength(2))
    expect(experimentViews()).toHaveLength(1)
  })

  it('sends nothing before the variant is known and sends once it is', async () => {
    makeTestSdk(
      () => new Promise(resolve => setTimeout(() => resolve(JSON.stringify(variantsFor('e3'))), 50))
    )
    render(
      <XaikuProvider sdk={sdk}>
        <Experiment id="e3" />
      </XaikuProvider>
    )

    expect(reports).toEqual([])
    await waitFor(() =>
      expect(experimentViews()).toEqual([
        { name: 'impression', experimentId: 'e3', variantId: 'v1' },
      ])
    )
  })

  it('a part rendered twice sends one part view', async () => {
    makeTestSdk(JSON.stringify(variantsFor('e4')))
    render(
      <XaikuProvider sdk={sdk}>
        <Text experimentId="e4" id="same" fallback="S" />
        <Text experimentId="e4" id="same" fallback="S" />
      </XaikuProvider>
    )

    await waitFor(() => expect(experimentViews()).toHaveLength(1))
    expect(partViews()).toHaveLength(1)
  })
})
