import { Context, ReactNode, ReactElement } from 'react';

export const ProjectContext: Context<string | null>;

export const useProjectId: () => string | null;

export interface ProjectProviderProps {
  id?: string;
  children?: ReactNode;
}

export declare const ProjectProvider: ({ id, children }: ProjectProviderProps) => ReactElement;
