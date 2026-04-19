import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, validateInput, sanitizeInput } from '@/lib/security';

let middlemen = [
  { id: '1', name: 'John Middle', email: 'john@middle.com', rating: 4.6, isVerified: true },
  { id: '2', name: 'Jane Middle', email: 'jane@middle.com', rating: 4.1, isVerified: false },
];

const middlemanSchema = {
  name: { type: 'string', required: true, min: 1, max: 200 },
  email: { type: 'string', required: true, min: 3, max: 254, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
};

const idSchema = {
  id: { type: 'string', required: true },
};

export async function GET(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  return NextResponse.json(middlemen);
}

export async function POST(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  try {
    const body = await request.json();
    
    const validation = validateInput(body, middlemanSchema);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const newMiddleman = {
      id: crypto.randomUUID(),
      name: sanitizeInput(body.name).slice(0, 200),
      email: sanitizeInput(body.email).slice(0, 254),
      rating: 0,
      isVerified: false,
    };
    middlemen.push(newMiddleman);
    return NextResponse.json(newMiddleman, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create middleman' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;
  
  try {
    const body = await request.json();
    
    const validation = validateInput(body, { ...idSchema, ...middlemanSchema });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    middlemen = middlemen.map((m) => m.id === body.id ? { ...m, ...body } : m);
    return NextResponse.json(middlemen.find((m) => m.id === body.id));
  } catch {
    return NextResponse.json({ error: 'Failed to update middleman' }, { status: 500 });
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

    middlemen = middlemen.filter((m) => m.id !== id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete middleman' }, { status: 500 });
  }
}