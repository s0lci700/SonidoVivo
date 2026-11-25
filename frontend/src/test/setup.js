import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { simularApi } from './apiSimulada';
import { cerrarSesion } from '../services/authService';

// Cada prueba parte sin sesión y con un backend falso recién cargado.
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  cerrarSesion();
  simularApi();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
