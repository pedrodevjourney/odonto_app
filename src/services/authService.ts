import { apiFetch } from './api';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
