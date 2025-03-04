import { Context, ReactNode, ReactElement } from 'react';
import { SdkInstance } from "@xaiku/shared"

export const XaikuContext: Context<string | null>;

export const useSDK: () => string | null;

export interface ProviderProps {
  id?: string;
  children?: ReactNode;
  pkey?: string;
  sdk?: SdkInstance;
  userId?: string;
  [key: string]: any;
}

export declare const ProjectProvider: ({ id, pkey, userId, sdk, children }: ProviderProps) => ReactElement;
