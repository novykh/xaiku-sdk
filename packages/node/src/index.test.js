import makeSDK from '.'
import makeCoreSdk from '@xaiku/core'
import { makeProjects, isBrowser } from '@xaiku/shared'
import makeClient from './client'

jest.mock('@xaiku/core')
jest.mock('@xaiku/shared', () => ({
  makeProjects: jest.fn(),
  isBrowser: jest.fn(),
}))
jest.mock('./client')

describe('SDK factory', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('throws error if isBrowser() returns true', async () => {
    isBrowser.mockReturnValue(true)
    makeCoreSdk.mockReturnValue({
      options: { framework: 'node' },
      destroy: jest.fn(),
    })

    await expect(makeSDK()).rejects.toThrow('@xaiku node runs only on Node.js/server environments.')
  })

  test('initializes sdk and sets client when skipClient is false (or not set)', async () => {
    isBrowser.mockReturnValue(false)
    const parentDestroy = jest.fn()
    const dummySdk = {
      options: { framework: 'node', skipClient: false },
      destroy: parentDestroy,
    }
    makeCoreSdk.mockReturnValue(dummySdk)
    const dummyClient = { destroy: jest.fn() }
    makeClient.mockReturnValue(dummyClient)
    makeProjects.mockResolvedValue()

    const instance = await makeSDK({ customOption: 'foo' })

    expect(instance).toBe(dummySdk)
    expect(makeClient).toHaveBeenCalledWith(dummySdk)
    expect(dummySdk.client).toBe(dummyClient)
    expect(makeProjects).toHaveBeenCalledWith(dummySdk)
  })

  test('does not set client when skipClient is true', async () => {
    isBrowser.mockReturnValue(false)
    const parentDestroy = jest.fn()
    const dummySdk = {
      options: { framework: 'node', skipClient: true },
      destroy: parentDestroy,
    }
    makeCoreSdk.mockReturnValue(dummySdk)
    makeProjects.mockResolvedValue()

    await makeSDK()

    expect(makeClient).not.toHaveBeenCalled()
    expect(dummySdk.client).toBeUndefined()
  })

  test('destroy method calls client.destroy (if exists), parent destroy, and then sets instance to null', async () => {
    isBrowser.mockReturnValue(false)
    const clientDestroy = jest.fn()
    const parentDestroy = jest.fn()
    const dummySdk = {
      options: { framework: 'node', skipClient: false },
      destroy: parentDestroy,
    }
    makeCoreSdk.mockReturnValue(dummySdk)
    makeClient.mockReturnValue({ destroy: clientDestroy })
    makeProjects.mockResolvedValue()

    const instance = await makeSDK()

    instance.destroy()

    expect(clientDestroy).toHaveBeenCalled()
    expect(parentDestroy).toHaveBeenCalled()

    instance.destroy()
    expect(clientDestroy).toHaveBeenCalledTimes(1)
  })
})
