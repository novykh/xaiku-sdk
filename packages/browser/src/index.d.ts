interface StoreOptions {
  name: 'localStorage'
  custom: any | null
}

interface Options {
  framework?: string
  store?: StoreOptions
  skipClient?: boolean
  [key: string]: any
}

interface PerformanceObserverInstance {
  connect: () => void
  disconnect: () => void
}

interface SdkInstance {
  options: Options
  trigger: (event: string, data?: any) => void
  client?: {
    destroy?: () => void
  }
  pos: PerformanceObserverInstance
  on: (event: string, callback: () => void) => void
  destroy: () => void
}

declare function makeXaikuSdk(options?: Options): SdkInstance

export default makeXaikuSdk
