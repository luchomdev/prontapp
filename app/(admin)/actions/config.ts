'use server'

import { cookies } from 'next/headers'

export interface Config {
  key: string;
  value: string | number;
}

export async function fetchConfigs(): Promise<Config[]> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/config`,
      {
        credentials: 'include',
        headers: {
          'Cookie': cookies().toString() || ''
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch configs');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchConfigs server action:', error);
    throw error;
  }
}

export async function updateConfig(config: Config): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/config/update`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies().toString() || ''
        },
        credentials: 'include',
        body: JSON.stringify(config)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update config');
    }

    return true;
  } catch (error) {
    console.error('Error in updateConfig server action:', error);
    throw error;
  }
}

export async function createConfig(config: Config): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/config/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies().toString() || ''
        },
        credentials: 'include',
        body: JSON.stringify(config)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create config');
    }

    return true;
  } catch (error) {
    console.error('Error in createConfig server action:', error);
    throw error;
  }
}