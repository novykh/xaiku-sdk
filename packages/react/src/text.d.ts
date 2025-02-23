import { ReactNode, ReactElement } from 'react';

export const useText: (projectId: string | null, id: string, fallback: ReactNode) => ReactNode;

export interface TextProps {
  id: string;
  projectId?: string | null;
  children: ReactNode | ((text: string) => ReactNode);
  fallback: ReactNode;
}

export declare const Text: ({ id, projectId, children, fallback }: TextProps) => ReactElement | null;
