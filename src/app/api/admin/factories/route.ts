import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, validateInput, sanitizeInput } from '@/lib/security';

let factories = [
  { id: '1', factoryName: 'Alpha Factory', email: 'alpha@factory.com', rating: 4.8, isVerified: true },
  { id: '2', factoryName: 'Beta Manufacturing', email: 'beta@factory.com', rating: 4.3, isVerified: false },
];

const factorySchema = {
  factoryName: { type: 'string', required: true, min: 1, max: 200 },
  email: { type: 'string', required: true, min: 3, max: 254, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
};

const idSchema = {
  id: { type: 'string', required: true },
};

export async function GET(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  return NextResponse.json(factories);
}

export async function POST(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  try {
    const body = await request.json();
    
    const validation = validateInput(body, factorySchema);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const newFactory = {
      id: crypto.randomUUID(),
      factoryName: sanitizeInput(body.factoryName).slice(0, 200),
      email: sanitizeInput(body.email).slice(0, 254),
      rating: 0,
      isVerified: false,
    };
    factories.push(newFactory);
    return NextResponse.json(newFactory, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create factory' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  try {
    const body = await request.json();
    
    const validation = validateInput(body, { ...idSchema, ...factorySchema });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    factories = factories.map((f) => f.id === body.id ? { ...f, ...body } : f);
    return NextResponse.json(factories.find((f) => f.id === body.id));
  } catch {
    return NextResponse.json({ error: 'Failed to update factory' }, { status: 500 });
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

    factories = factories.filter((f) => f.id !== id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete factory' }, { status: 500 });
  }
}