import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, validateInput, sanitizeInput } from '@/lib/security';

let sellers = [
  { id: '1', storeName: 'Aurora Store', email: 'store@aurora.com', rating: 4.5, isVerified: true },
  { id: '2', storeName: 'Tech Hub', email: 'tech@hub.com', rating: 4.2, isVerified: false },
];

const sellerSchema = {
  storeName: { type: 'string', required: true, min: 1, max: 200 },
  email: { type: 'string', required: true, min: 3, max: 254, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
};

const idSchema = {
  id: { type: 'string', required: true },
};

export async function GET(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  return NextResponse.json(sellers);
}

export async function POST(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  try {
    const body = await request.json();
    
    const validation = validateInput(body, sellerSchema);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const newSeller = {
      id: crypto.randomUUID(),
      storeName: sanitizeInput(body.storeName).slice(0, 200),
      email: sanitizeInput(body.email).slice(0, 254),
      rating: 0,
      isVerified: false,
    };
    sellers.push(newSeller);
    return NextResponse.json(newSeller, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create seller' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  try {
    const body = await request.json();
    
    const validation = validateInput(body, { ...idSchema, ...sellerSchema });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    sellers = sellers.map((s) => s.id === body.id ? { ...s, ...body } : s);
    return NextResponse.json(sellers.find((s) => s.id === body.id));
  } catch {
    return NextResponse.json({ error: 'Failed to update seller' }, { status: 500 });
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

    sellers = sellers.filter((s) => s.id !== id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete seller' }, { status: 500 });
  }
}