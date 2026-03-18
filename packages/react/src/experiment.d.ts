import { Context, ReactNode, ReactElement } from 'react';

export const ExperimentContext: Context<string | null>;

export const useExperimentId: () => string | null;

export interface ExperimentProviderProps {
  id?: string;
  children?: ReactNode;
}

export declare const ExperimentProvider: ({ id, children }: ExperimentProviderProps) => ReactElement;
