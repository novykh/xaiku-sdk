import { Store, SdkInstance } from '~/types'

export type StoreNames = 'cookie' | 'localStorage' | 'sessionStorage' | 'memory'

export const storeNames: Record<StoreNames, string>

export const stores: Record<StoreNames, (sdk: SdkInstance) => Store>

declare function makeStore(sdk: SdkInstance): Store

export default makeStore
