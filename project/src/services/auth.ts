import { LoginCredentials } from '../types';

const url = import.meta.env.VITE_API_URL;

export async function login(credentials: LoginCredentials): Promise<string> {
  const response = await fetch(`${url}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  const token = data.token;
  
  localStorage.setItem('jwt_token', token);
  
  return token;
}