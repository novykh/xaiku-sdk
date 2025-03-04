import { ReactNode } from 'react'
import { SdkInstance } from "@xaiku/shared"

export interface ProviderProps {
  children: ReactNode;
  pkey?: string;
  userId?: string;
  sdk?: SdkInstance;
  [key: string]: any;
}

declare const Provider: (props: ProviderProps) => Promise<JSX.Element>

export default Provider
