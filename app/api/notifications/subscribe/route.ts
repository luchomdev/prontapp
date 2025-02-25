import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, keys, userAgent } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: 'Datos de suscripción incompletos' },
        { status: 400 }
      );
    }

    // Guardar en la base de datos
    const result = await pool.query(
      `INSERT INTO push_subscriptions 
        (endpoint, p256dh, auth, user_agent) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (endpoint) 
       DO UPDATE SET 
        p256dh = EXCLUDED.p256dh,
        auth = EXCLUDED.auth,
        user_agent = EXCLUDED.user_agent,
        is_active = true,
        updated_at = CURRENT_TIMESTAMP
       RETURNING id`,
      [endpoint, keys.p256dh, keys.auth, userAgent]
    );

    return NextResponse.json({
      success: true,
      subscriptionId: result.rows[0].id
    });
  } catch (error: any) {
    console.error('Error detallado al guardar suscripción:', error);
    return NextResponse.json(
      { 
        error: 'Error al procesar la suscripción',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint requerido' },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE push_subscriptions 
       SET is_active = false 
       WHERE endpoint = $1`,
      [endpoint]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error al eliminar suscripción:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}