import { NextRequest, NextResponse } from 'next/server';
import { generateToken, validateInput } from '@/lib/security';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const loginSchema = {
  email: { type: 'string', required: true, min: 3, max: 254, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { type: 'string', required: true, min: 8 },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = validateInput(body, loginSchema);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const { email, password } = body;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('Admin credentials not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = generateToken({ id: 'admin', email, role: 'admin' });
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}