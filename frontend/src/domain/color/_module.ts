/**
 * @module color
 * @summary Color management domain module
 * @domain functional
 * @version 1.0.0
 */

export * from './types';
export * from './services/colorService';
export * from './hooks/useColorList';
export * from './hooks/useColorStats';
export * from './components/ColorPicker';
export * from './components/ColorFilter';
export { ColorStats } from './components/ColorStats';

export const moduleMetadata = {
  name: 'color',
  domain: 'functional',
  version: '1.0.0',
  publicComponents: ['ColorPicker', 'ColorFilter', 'ColorStats'],
  publicHooks: ['useColorList', 'useColorStats'],
  publicServices: ['colorService'],
  dependencies: {
    internal: ['@/core/lib/api', '@/core/types'],
    external: ['react', '@tanstack/react-query'],
  },
} as const;
