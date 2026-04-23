import { NextRequest, NextResponse } from "next/server";
import {
  requireAdmin,
  validateInput,
  sanitizeInput,
  validateUUID,
  ValidationRule,
} from "@/lib/security";

/**
 * SECURITY: Sellers Management API
 *
 * Protections:
 * - Admin authentication required
 * - Input validation and sanitization
 * - SQL injection prevention via validated parameters
 * - UUID validation for IDs
 * - Rate limiting via middleware
 */

interface SellerData {
  id: string;
  storeName: string;
  email: string;
  rating: number;
  isVerified: boolean;
}

// In-memory store (replace with database in production)
let sellers: SellerData[] = [
  {
    id: "1",
    storeName: "Aurora Store",
    email: "store@aurora.com",
    rating: 4.5,
    isVerified: true,
  },
  {
    id: "2",
    storeName: "Tech Hub",
    email: "tech@hub.com",
    rating: 4.2,
    isVerified: false,
  },
];

const sellerSchema: Record<string, ValidationRule> = {
  storeName: {
    type: "string",
    required: true,
    min: 1,
    max: 200,
  },
  email: {
    type: "email",
    required: true,
    min: 3,
    max: 254,
  },
};

const sellerUpdateSchema: Record<string, ValidationRule> = {
  id: {
    type: "string",
    required: true,
    max: 36,
  },
  storeName: {
    type: "string",
    required: false,
    min: 1,
    max: 200,
  },
  email: {
    type: "email",
    required: false,
  },
};

/**
 * GET /api/admin/sellers - List all sellers
 */
export async function GET(request: NextRequest) {
  try {
    // ====================================================================
    // AUTHORIZATION
    // ====================================================================
    const authCheck = requireAdmin(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }

    return NextResponse.json(sellers);
  } catch (error) {
    console.error("Sellers GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sellers" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/sellers - Create new seller
 */
export async function POST(request: NextRequest) {
  try {
    // ====================================================================
    // AUTHORIZATION
    // ====================================================================
    const authCheck = requireAdmin(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }

    // ====================================================================
    // REQUEST BODY VALIDATION
    // ====================================================================
    const body = await request.json();

    const validation = validateInput(body, sellerSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    // ====================================================================
    // SANITIZATION - Prevent XSS & HTML injection
    // ====================================================================
    const sanitizedStoreName = sanitizeInput(body.storeName, 200);
    const sanitizedEmail = sanitizeInput(body.email, 254).toLowerCase();

    // ====================================================================
    // CREATE NEW SELLER
    // ====================================================================
    const newSeller = {
      id: crypto.randomUUID(),
      storeName: sanitizedStoreName,
      email: sanitizedEmail,
      rating: 0,
      isVerified: false,
    };

    sellers.push(newSeller);

    return NextResponse.json(newSeller, { status: 201 });
  } catch (error) {
    console.error("Sellers POST error:", error);
    return NextResponse.json(
      { error: "Failed to create seller" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/sellers - Update seller
 */
export async function PUT(request: NextRequest) {
  try {
    // ====================================================================
    // AUTHORIZATION
    // ====================================================================
    const authCheck = requireAdmin(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }

    // ====================================================================
    // REQUEST BODY VALIDATION
    // ====================================================================
    const body = await request.json();

    const validation = validateInput(body, sellerUpdateSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    // ====================================================================
    // ID VALIDATION - Prevent SQL injection
    // ====================================================================
    const { id } = body;
    if (!validateUUID(id) && !/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: "Invalid seller ID format" },
        { status: 400 },
      );
    }

    // ====================================================================
    // FIND SELLER
    // ====================================================================
    const sellerIndex = sellers.findIndex((s) => s.id === id);
    if (sellerIndex === -1) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    // ====================================================================
    // PREPARE UPDATE DATA
    // ====================================================================
    const updateData: SellerData = { ...sellers[sellerIndex] };

    if (body.storeName !== undefined) {
      updateData.storeName = String(sanitizeInput(body.storeName, 200));
    }

    if (body.email !== undefined) {
      updateData.email = String(sanitizeInput(body.email, 254)).toLowerCase();
    }

    // ====================================================================
    // UPDATE SELLER
    // ====================================================================
    sellers[sellerIndex] = updateData;

    return NextResponse.json(updateData);
  } catch (error) {
    console.error("Sellers PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update seller" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/sellers - Delete seller
 */
export async function DELETE(request: NextRequest) {
  try {
    // ====================================================================
    // AUTHORIZATION
    // ====================================================================
    const authCheck = requireAdmin(request);
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }

    // ====================================================================
    // PARAMETER EXTRACTION & VALIDATION
    // ====================================================================
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    // ====================================================================
    // ID FORMAT VALIDATION - Prevent SQL injection
    // ====================================================================
    if (!validateUUID(id) && !/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: "Invalid seller ID format" },
        { status: 400 },
      );
    }

    // ====================================================================
    // DELETE SELLER
    // ====================================================================
    const initialLength = sellers.length;
    sellers = sellers.filter((s) => s.id !== id);

    if (sellers.length === initialLength) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sellers DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete seller" },
      { status: 500 },
    );
  }
}
