import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, validateInput, sanitizeInput } from '@/lib/security';

let products = [
  { id: '1', title: 'Sample Product 1', price: 99.99, stock: 50, status: 'active' },
  { id: '2', title: 'Sample Product 2', price: 149.99, stock: 25, status: 'active' },
];

const productSchema = {
  title: { type: 'string', required: true, min: 1, max: 200 },
  price: { type: 'number', required: true, min: 0.01 },
  stock: { type: 'number', required: false, min: 0 },
  status: { type: 'string', required: false },
};

const idSchema = {
  id: { type: 'string', required: true },
};

export async function GET(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  try {
    const body = await request.json();
    
    const validation = validateInput(body, productSchema);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const newProduct = {
      id: crypto.randomUUID(),
      title: sanitizeInput(body.title).slice(0, 200),
      price: Math.max(0.01, parseFloat(body.price.toFixed(2))),
      stock: Math.max(0, parseInt(body.stock) || 0),
      status: ['active', 'inactive', 'draft'].includes(body.status) ? body.status : 'active',
    };
    products.push(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  try {
    const body = await request.json();
    
    const validation = validateInput(body, { ...idSchema, ...productSchema });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    products = products.map((p) => p.id === body.id ? { ...p, ...body } : p);
    return NextResponse.json(products.find((p) => p.id === body.id));
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    products = products.filter((p) => p.id !== id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}