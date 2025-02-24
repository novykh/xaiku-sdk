import { SdkInstance } from './types'

export interface Store {
  name: string,
  get: (key: string) => string | null
  set: (key: string, value: string, options?: any) => void
  remove: (key: string) => void
  supported: boolean
}

export type StoreNames = 'cookie' | 'localStorage' | 'sessionStorage' | 'memory'

export const storeNames: Record<StoreNames, string>

export const stores: Record<StoreNames, (sdk: SdkInstance) => Store>

declare function makeStore(sdk: SdkInstance): Store

export default makeStore
