'use server';

import { pool } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import webpush from 'web-push';

// Configuración de las credenciales VAPID
webpush.setVapidDetails(
  'mailto:info@prontapp.co',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export interface PushCampaign {
  id: string;
  title: string;
  body: string;
  image_url: string;
  tag: string;
  type: string;
  primary_action: string;
  target_url: string;
  is_active: boolean;
  sent_count: number;
  last_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  campaigns: PushCampaign[];
  totalPages: number;
  currentPage: number;
}

// Función para obtener campañas paginadas
export async function fetchPushCampaignsServer(page: number = 1, limit: number = 9): Promise<PaginatedResponse> {
  try {
    const offset = (page - 1) * limit;
    
    // Consulta para obtener campañas con paginación
    const result = await pool.query(
      `SELECT * FROM push_campaigns 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    // Consulta para obtener el conteo total
    const countResult = await pool.query('SELECT COUNT(*) FROM push_campaigns');
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      campaigns: result.rows,
      totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching push campaigns:', error);
    throw new Error('Failed to fetch push campaigns');
  }
}

// Función para crear una nueva campaña
export async function createPushCampaignServer(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const tag = formData.get('tag') as string;
    const type = formData.get('type') as string;
    const primaryAction = formData.get('primaryAction') as string;
    const targetUrl = formData.get('targetUrl') as string;
    
    const result = await pool.query(
      `INSERT INTO push_campaigns 
        (title, body, image_url, tag, type, primary_action, target_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, body, imageUrl, tag, type, primaryAction, targetUrl]
    );
    
    revalidatePath('/console/notifications');
    return result.rows[0];
  } catch (error) {
    console.error('Error creating push campaign:', error);
    throw new Error('Failed to create push campaign');
  }
}

// Función para obtener una campaña por ID
export async function getPushCampaignByIdServer(id: string): Promise<PushCampaign> {
  try {
    const result = await pool.query(
      'SELECT * FROM push_campaigns WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Push campaign not found');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching push campaign:', error);
    throw new Error('Failed to fetch push campaign');
  }
}

// Función para actualizar una campaña
export async function updatePushCampaignServer(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const tag = formData.get('tag') as string;
    const type = formData.get('type') as string;
    const primaryAction = formData.get('primaryAction') as string;
    const targetUrl = formData.get('targetUrl') as string;
    
    const result = await pool.query(
      `UPDATE push_campaigns 
       SET title = $1, body = $2, image_url = $3, tag = $4, type = $5, primary_action = $6, target_url = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, body, imageUrl, tag, type, primaryAction, targetUrl, id]
    );
    
    revalidatePath('/console/notifications');
    revalidatePath(`/console/notifications/campaign/${id}`);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating push campaign:', error);
    throw new Error('Failed to update push campaign');
  }
}

// Función para cambiar el estado activo/inactivo de una campaña
export async function togglePushCampaignActiveServer(id: string) {
  try {
    const result = await pool.query(
      `UPDATE push_campaigns 
       SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    
    revalidatePath('/console/notifications');
    return result.rows[0];
  } catch (error) {
    console.error('Error toggling push campaign status:', error);
    throw new Error('Failed to toggle campaign status');
  }
}

// Función para enviar una campaña
export async function sendPushCampaignServer(id: string) {
  try {
    // Obtener detalles de la campaña
    const campaignResult = await pool.query(
      'SELECT * FROM push_campaigns WHERE id = $1 AND is_active = true',
      [id]
    );
    
    if (campaignResult.rows.length === 0) {
      throw new Error('Campaign not found or not active');
    }
    
    const campaign = campaignResult.rows[0];
    
    // Obtener todas las suscripciones activas
    const subscriptionsResult = await pool.query(
      'SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE is_active = true'
    );
    
    if (subscriptionsResult.rows.length === 0) {
      throw new Error('No active subscriptions found');
    }
    
    // Preparar el payload de la notificación
    const notificationPayload = JSON.stringify({
      title: campaign.title,
      body: campaign.body,
      image: campaign.image_url,
      tag: campaign.tag,
      type: campaign.type,
      id: campaign.id,
      primaryAction: campaign.primary_action,
      data: {
        url: campaign.target_url,
        type: campaign.type,
        id: campaign.id
      }
    });
    
    let successCount = 0;
    let expiredCount = 0;
    
    // Enviar notificación a todas las suscripciones activas
    for (const subscription of subscriptionsResult.rows) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth
            }
          },
          notificationPayload
        );
        successCount++;
      } catch (error: any) {
        console.error('Error sending notification:', error);
        
        // Si la suscripción expiró (código 410), marcarla como inactiva
        if (error.statusCode === 410) {
          await pool.query(
            'UPDATE push_subscriptions SET is_active = false WHERE id = $1',
            [subscription.id]
          );
          expiredCount++;
        }
      }
    }
    
    // Actualizar el conteo de envíos y la última fecha de envío
    await pool.query(
      `UPDATE push_campaigns 
       SET sent_count = sent_count + $1, last_sent_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [successCount, id]
    );
    
    revalidatePath('/console/notifications');
    
    return {
      success: true,
      campaign: campaign.title,
      sentCount: successCount,
      expiredCount
    };
  } catch (error) {
    console.error('Error sending push campaign:', error);
    throw new Error('Failed to send push campaign');
  }
}