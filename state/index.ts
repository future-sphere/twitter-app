import { createState } from '@hookstate/core';

export const token = createState<string | null>(null);
export const user = createState(null);
