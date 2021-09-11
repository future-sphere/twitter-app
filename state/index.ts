import { createState } from '@hookstate/core';

interface User {
  username: string;
  avatar: string;
  friends: [string];
  _id: string;
  password: string;
  phone: string;
  email: string;
  gender: number;
  bio: string;
  dob: Date;
}

export const token = createState<string | null>(null);
export const user = createState<User | null>(null);
