// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '9');
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
    
    return NextResponse.json({
      campaigns: result.rows,
      totalPages,
      currentPage: page,
      totalCount
    });
  } catch (error) {
    console.error('Error fetching push campaigns:', error);
    return NextResponse.json(
      { error: 'Error fetching push campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, body, image_url, tag, type, primary_action, target_url } = data;
    
    // Validaciones básicas
    if (!title || !body || !tag || !type || !primary_action || !target_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const result = await pool.query(
      `INSERT INTO push_campaigns 
        (title, body, image_url, tag, type, primary_action, target_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, body, image_url, tag, type, primary_action, target_url]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating push campaign:', error);
    return NextResponse.json(
      { error: 'Error creating push campaign' },
      { status: 500 }
    );
  }
}