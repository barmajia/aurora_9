import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  validateInput,
  validateUUID,
  validateNumericId,
  sanitizeInput,
  ValidationRule,
} from "@/lib/security";
import { safeSelect, safeUpdate, QueryFilter } from "@/lib/database";

/**
 * SECURITY: Orders API Endpoint
 *
 * Protections:
 * - JWT authentication required
 * - SQL injection prevention via safe query builders
 * - Input validation on all parameters
 * - Proper error handling without exposing internal details
 */

const orderQuerySchema: Record<string, ValidationRule> = {
  userId: {
    type: "string",
    required: false,
    max: 36, // UUID length
  },
  orderId: {
    type: "string",
    required: false,
    max: 36, // UUID length
  },
  status: {
    type: "enum",
    required: false,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
  },
};

const orderUpdateSchema: Record<string, ValidationRule> = {
  orderId: {
    type: "string",
    required: true,
    max: 36,
  },
  status: {
    type: "enum",
    required: false,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
  },
  notes: {
    type: "string",
    required: false,
    max: 1000,
  },
};

export async function GET(request: NextRequest) {
  try {
    // ====================================================================
    // AUTHENTICATION
    // ====================================================================
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    // ====================================================================
    // PARAMETER EXTRACTION & VALIDATION
    // ====================================================================
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");

    // Validate input
    const queryParams = {
      ...(userId && { userId }),
      ...(orderId && { orderId }),
      ...(status && { status }),
    };

    const validation = validateInput(queryParams, orderQuerySchema);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 },
      );
    }

    // ====================================================================
    // BUILD SAFE FILTERS
    // ====================================================================
    const filters: QueryFilter[] = [];

    if (userId) {
      if (!validateUUID(userId) && !validateNumericId(userId)) {
        return NextResponse.json(
          { error: "Invalid user ID format" },
          { status: 400 },
        );
      }
      filters.push({ column: "user_id", operator: "eq", value: userId });
    }

    if (status) {
      const validStatuses = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      filters.push({ column: "status", operator: "eq", value: status });
    }

    // ====================================================================
    // PAGINATION
    // ====================================================================
    const limit = limitParam ? Math.min(parseInt(limitParam), 100) : 50;
    const offset = offsetParam ? Math.max(0, parseInt(offsetParam)) : 0;

    if (isNaN(limit) || isNaN(offset) || limit < 1 || offset < 0) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    // ====================================================================
    // SAFE QUERY EXECUTION
    // ====================================================================
    try {
      const query = await safeSelect("orders", {
        select: "*",
        filters,
        orderBy: [{ column: "created_at", ascending: false }],
        limit,
        offset,
      });

      const { data: orders, error } = await query;

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to fetch orders" },
          { status: 500 },
        );
      }

      // ================================================================
      // FILTER BY SINGLE ORDER ID (CLIENT-SIDE IF NEEDED)
      // ================================================================
      if (orderId) {
        if (!validateUUID(orderId) && !validateNumericId(orderId)) {
          return NextResponse.json(
            { error: "Invalid order ID format" },
            { status: 400 },
          );
        }

        const filteredOrders = (orders || []).filter(
          (o: any) => o.id === orderId,
        );
        return NextResponse.json({ orders: filteredOrders || [] });
      }

      return NextResponse.json({ orders: orders || [] });
    } catch (err) {
      console.error("Query error:", err);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // ====================================================================
    // AUTHENTICATION
    // ====================================================================
    const auth = requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    // ====================================================================
    // REQUEST BODY VALIDATION
    // ====================================================================
    const body = await request.json();

    const validation = validateInput(body, orderUpdateSchema);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    const { orderId, status, notes } = body;

    // ====================================================================
    // PARAMETER VALIDATION
    // ====================================================================
    if (!validateUUID(orderId) && !validateNumericId(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID format" },
        { status: 400 },
      );
    }

    // ====================================================================
    // PREPARE UPDATE DATA
    // ====================================================================
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      const validStatuses = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: "Invalid status value" },
          { status: 400 },
        );
      }
      updates.status = status;
    }

    if (notes) {
      updates.notes = sanitizeInput(notes, 1000);
    }

    // ====================================================================
    // SAFE UPDATE EXECUTION
    // ====================================================================
    try {
      const updatedOrder = await safeUpdate("orders", orderId, updates);
      return NextResponse.json({ order: updatedOrder });
    } catch (err) {
      console.error("Update error:", err);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
