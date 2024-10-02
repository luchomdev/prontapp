import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

// Helper para componentes del servidor
export async function isAuthenticated() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return false;

  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch (error) {
    return false;
  }
}



// Helper para obtener el usuario actual en el servidor
export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}