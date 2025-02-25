// app/api/notifications/[id]/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;
    
    const result = await pool.query(
      'SELECT * FROM push_campaigns WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching push campaign:', error);
    return NextResponse.json(
      { error: 'Error fetching push campaign' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;
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
      `UPDATE push_campaigns 
       SET title = $1, body = $2, image_url = $3, tag = $4, type = $5, 
           primary_action = $6, target_url = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [title, body, image_url, tag, type, primary_action, target_url, id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating push campaign:', error);
    return NextResponse.json(
      { error: 'Error updating push campaign' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;
    const data = await request.json();
    
    // Verificamos si es un toggle de activación
    if ('is_active' in data) {
      const result = await pool.query(
        `UPDATE push_campaigns 
         SET is_active = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [data.is_active, id]
      );
      
      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Campaign not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(result.rows[0]);
    }
    
    // Si no es un toggle, actualizamos solo los campos proporcionados
    const fields: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;
    
    Object.entries(data).forEach(([key, value]) => {
      // Solo permitimos actualizar ciertos campos
      if (['title', 'body', 'image_url', 'tag', 'type', 'primary_action', 'target_url'].includes(key)) {
        fields.push(`${key} = $${paramCounter++}`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    // Añadimos la marca de tiempo
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    // Añadimos el ID al final de los valores
    values.push(id);
    
    const result = await pool.query(
      `UPDATE push_campaigns 
       SET ${fields.join(', ')}
       WHERE id = $${paramCounter}
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating push campaign:', error);
    return NextResponse.json(
      { error: 'Error updating push campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const id = params.id;
    
    const result = await pool.query(
      'DELETE FROM push_campaigns WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, deleted: result.rows[0] });
  } catch (error) {
    console.error('Error deleting push campaign:', error);
    return NextResponse.json(
      { error: 'Error deleting push campaign' },
      { status: 500 }
    );
  }
}