import { Context, ReactNode, ReactElement } from 'react';

export const XaikuContext: Context<string | null>;

export const useSDK: () => string | null;

export interface ProjectProviderProps {
  id?: string;
  children?: ReactNode;
}

export declare const ProjectProvider: ({ id, children }: ProjectProviderProps) => ReactElement;
