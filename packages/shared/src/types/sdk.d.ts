import Store from "~/storage"

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

export interface SdkInstance {
  options: Options
  trigger: (event: string, data?: any) => void
  client?: {
    destroy?: () => void
  }
  pos: PerformanceObserverInstance
  on: (event: string, callback: () => void) => void
  destroy: () => void
}
