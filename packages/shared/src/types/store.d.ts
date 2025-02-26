export interface Store {
  name: string,
  get: (key: string) => string | null
  set: (key: string, value: string, options?: any) => void
  remove: (key: string) => void
  supported: boolean
}
