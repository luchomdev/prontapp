'use server'

import { cookies } from 'next/headers'

// Solicitar recuperación de contraseña
export async function requestPasswordRecoveryServer(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/users/request-reset`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to request password reset');
    }

    return {
      success: true,
      message: 'Se ha enviado un código de verificación a su correo'
    };
  } catch (error) {
    console.error('Error in requestPasswordRecoveryServer:', error);
    return {
      success: false,
      message: 'Error al solicitar la recuperación de contraseña'
    };
  }
}

interface VerifyCodeResponse {
  success: boolean;
  message: string;
  token: string;
}

// Verificar código de recuperación
export async function verifyRecoveryCodeServer(
    email: string,
    code: string
  ): Promise<VerifyCodeResponse> {
    try {
      const response = await fetch(
        `${process.env.API_BASE_URL}/users/verify-reset`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, code })
        }
      );
  
      if (!response.ok) {
        throw new Error('Failed to verify code');
      }
  
      const data = await response.json();
      
      if (!data.token) {
        return {
          success: false,
          message: 'No se recibió el token de verificación',
          token: '' // Proporcionamos un valor por defecto
        };
      }
  
      return {
        success: true,
        message: 'Código verificado correctamente',
        token: data.token
      };
    } catch (error) {
      console.error('Error in verifyRecoveryCodeServer:', error);
      return {
        success: false,
        message: 'Error al verificar el código',
        token: '' // Proporcionamos un valor por defecto
      };
    }
  }

// Restablecer contraseña
export async function resetPasswordServer(
  email: string,
  newPassword: string,
  token: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/users/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword, token })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to reset password');
    }

    return {
      success: true,
      message: 'Contraseña restablecida con éxito'
    };
  } catch (error) {
    console.error('Error in resetPasswordServer:', error);
    return {
      success: false,
      message: 'Error al restablecer la contraseña'
    };
  }
}