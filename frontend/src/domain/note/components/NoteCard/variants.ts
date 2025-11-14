import { clsx } from 'clsx';

export function getNoteCardClassName(): string {
  return clsx('p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md bg-white');
}
