import { createState } from '@hookstate/core';

interface User {
  username: string;
  avatar: string;
  friends: [string];
}

export const token = createState<string | null>(null);
export const user = createState<User | null>(null);
