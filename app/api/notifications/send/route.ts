// app/api/notifications/send/route.ts
import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { pool } from '@/lib/db';

webpush.setVapidDetails(
  'mailto:info@prontapp.co',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { campaignId } = data;
    
    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    
    // Obtener detalles de la campaña
    const campaignResult = await pool.query(
      'SELECT * FROM push_campaigns WHERE id = $1 AND is_active = true',
      [campaignId]
    );
    
    if (campaignResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found or not active' },
        { status: 404 }
      );
    }
    
    const campaign = campaignResult.rows[0];
    
    // Obtener todas las suscripciones activas
    const subscriptionsResult = await pool.query(
      'SELECT id, endpoint, p256dh, auth FROM push_subscriptions WHERE is_active = true'
    );
    
    if (subscriptionsResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'No active subscriptions found' },
        { status: 404 }
      );
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
    let errorCount = 0;
    
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
        } else {
          errorCount++;
        }
      }
    }
    
    // Actualizar el conteo de envíos y la última fecha de envío
    await pool.query(
      `UPDATE push_campaigns 
       SET sent_count = sent_count + $1, last_sent_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [successCount, campaignId]
    );
    
    return NextResponse.json({
      success: true,
      campaign: campaign.title,
      stats: {
        total: subscriptionsResult.rows.length,
        successful: successCount,
        expired: expiredCount,
        errors: errorCount
      }
    });
  } catch (error) {
    console.error('Error sending push notification:', error);
    return NextResponse.json(
      { error: 'Error sending push notification' },
      { status: 500 }
    );
  }
}