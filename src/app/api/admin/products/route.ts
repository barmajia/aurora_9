import { NextRequest, NextResponse } from "next/server";
import {
  requireAdmin,
  validateInput,
  sanitizeInput,
  validateUUID,
  ValidationRule,
} from "@/lib/security";

/**
 * SECURITY: Products Management API
 *
 * Protections:
 * - Admin authentication required
 * - Input validation and type checking
 * - Price validation and sanitization
 * - SQL injection prevention
 * - Enum validation for status
 */

interface ProductData {
  id: string;
  title: string;
  price: number;
  stock: number;
  status: string;
}

let products: ProductData[] = [
  {
    id: "1",
    title: "Sample Product 1",
    price: 99.99,
    stock: 50,
    status: "active",
  },
  {
    id: "2",
    title: "Sample Product 2",
    price: 149.99,
    stock: 25,
    status: "active",
  },
];

const productSchema: Record<string, ValidationRule> = {
  title: {
    type: "string",
    required: true,
    min: 1,
    max: 200,
  },
  price: {
    type: "number",
    required: true,
    min: 0.01,
    max: 999999.99,
  },
  stock: {
    type: "number",
    required: false,
    min: 0,
    max: 999999,
  },
  status: {
    type: "enum",
    required: false,
    enum: ["active", "inactive", "draft"],
  },
};

const productUpdateSchema: Record<string, ValidationRule> = {
  id: {
    type: "string",
    required: true,
    max: 36,
  },
  title: {
    type: "string",
    required: false,
    min: 1,
    max: 200,
  },
  price: {
    type: "number",
    required: false,
    min: 0.01,
    max: 999999.99,
  },
  stock: {
    type: "number",
    required: false,
    min: 0,
    max: 999999,
  },
  status: {
    type: "enum",
    required: false,
    enum: ["active", "inactive", "draft"],
  },
};

/**
 * GET /api/admin/products - List all products
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

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/products - Create new product
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

    const validation = validateInput(body, productSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    // ====================================================================
    // TYPE CASTING & SANITIZATION
    // ====================================================================
    const sanitizedTitle = sanitizeInput(body.title, 200);
    const price = parseFloat(body.price.toFixed(2));
    const stock = Math.max(0, parseInt(String(body.stock) || "0", 10));
    const status = ["active", "inactive", "draft"].includes(body.status)
      ? body.status
      : "active";

    // ====================================================================
    // VALIDATION CHECKS
    // ====================================================================
    if (isNaN(price) || price < 0.01) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    if (stock < 0) {
      return NextResponse.json(
        { error: "Invalid stock quantity" },
        { status: 400 },
      );
    }

    // ====================================================================
    // CREATE PRODUCT
    // ====================================================================
    const newProduct = {
      id: crypto.randomUUID(),
      title: sanitizedTitle,
      price,
      stock,
      status,
    };

    products.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/products - Update product
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

    const validation = validateInput(body, productUpdateSchema);
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
        { error: "Invalid product ID format" },
        { status: 400 },
      );
    }

    // ====================================================================
    // FIND PRODUCT
    // ====================================================================
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ====================================================================
    // PREPARE UPDATE DATA
    // ====================================================================
    const updateData: ProductData = { ...products[productIndex] };

    if (body.title !== undefined) {
      updateData.title = String(sanitizeInput(body.title, 200));
    }

    if (body.price !== undefined) {
      const newPrice = parseFloat(parseFloat(String(body.price)).toFixed(2));
      if (isNaN(Number(newPrice))) {
        return NextResponse.json({ error: "Invalid price" }, { status: 400 });
      }
      updateData.price = Number(newPrice);
    }

    if (body.stock !== undefined) {
      const newStock = Math.max(0, parseInt(String(body.stock), 10));
      updateData.stock = newStock;
    }

    if (body.status !== undefined) {
      if (["active", "inactive", "draft"].includes(String(body.status))) {
        updateData.status = String(body.status);
      } else {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 },
        );
      }
    }

    // ====================================================================
    // UPDATE PRODUCT
    // ====================================================================
    products[productIndex] = updateData;

    return NextResponse.json(updateData);
  } catch (error) {
    console.error("Products PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/products - Delete product
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
        { error: "Invalid product ID format" },
        { status: 400 },
      );
    }

    // ====================================================================
    // DELETE PRODUCT
    // ====================================================================
    const initialLength = products.length;
    products = products.filter((p) => p.id !== id);

    if (products.length === initialLength) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Products DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
