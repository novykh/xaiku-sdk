import { ReactNode } from 'react'

export interface ProviderProps {
  children: ReactNode
  pkey?: string
  userId?: string
  sdk?: any
  [key: string]: any
}

declare const Provider: (props: ProviderProps) => Promise<JSX.Element>

export default Provider
