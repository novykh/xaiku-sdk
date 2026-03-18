import { ReactNode, ReactElement } from 'react';

export const useText: (experimentId: string | null, id: string, fallback: ReactNode) => ReactNode;

export interface TextProps {
  id: string;
  experimentId?: string | null;
  children: ReactNode | ((text: string) => ReactNode);
  fallback: ReactNode;
}

export declare const Text: ({ id, experimentId, children, fallback }: TextProps) => ReactElement | null;
