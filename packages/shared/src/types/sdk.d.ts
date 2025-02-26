import Store from "./store"

export interface StoreOptions {
  name: string
  custom: any | null
}

export interface Options {
  framework?: string
  store?: StoreOptions
  skipClient?: boolean
  [key: string]: any
}

export interface PerformanceObserverInstance {
  connect: () => void
  disconnect: () => void
}

interface SdkBaseInstance {
  options: Options
  trigger: (event: string, data?: any) => void
  client?: {
    destroy?: () => void
  }
  on: (event: string, callback: () => void) => void
  destroy: () => void
}

export interface SdkInstance extends SdkBaseInstance {
  pos: PerformanceObserverInstance
}

export type SdkNodeInstance = SdkBaseInstance
