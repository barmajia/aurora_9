import { supabase } from "./supabase";
import {
  validateSqlIdentifier,
  validateUUID,
  validateNumericId,
} from "./security";

/**
 * SECURITY: SQL Injection Prevention Layer
 *
 * This module provides safe query builders that:
 * - Validate all parameters before query execution
 * - Use Supabase's parameterized queries
 * - Prevent common SQL injection patterns
 * - Enforce type safety on identifiers and values
 */

// ============================================================================
// QUERY BUILDER HELPERS
// ============================================================================

export interface QueryFilter {
  column: string;
  operator:
    | "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "like"
    | "ilike"
    | "in"
    | "is";
  value: unknown;
}

export interface QueryOptions {
  select?: string;
  filters?: QueryFilter[];
  orderBy?: { column: string; ascending?: boolean }[];
  limit?: number;
  offset?: number;
}

/**
 * Validates and sanitizes table name to prevent injection
 */
export function validateTableName(tableName: string): boolean {
  return validateSqlIdentifier(tableName) && tableName.length <= 64;
}

/**
 * Validates and sanitizes column name to prevent injection
 */
export function validateColumnName(columnName: string): boolean {
  return validateSqlIdentifier(columnName) && columnName.length <= 64;
}

/**
 * Validates filter to prevent injection
 */
export function validateQueryFilter(filter: QueryFilter): boolean {
  // Validate column name
  if (!validateColumnName(filter.column)) {
    return false;
  }

  // Validate operator
  const validOperators = [
    "eq",
    "neq",
    "gt",
    "gte",
    "lt",
    "lte",
    "like",
    "ilike",
    "in",
    "is",
  ];
  if (!validOperators.includes(filter.operator)) {
    return false;
  }

  return true;
}

/**
 * Safely apply filters to a query
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyFilters(query: any, filters: QueryFilter[]): any {
  for (const filter of filters) {
    // Validate each filter
    if (!validateQueryFilter(filter)) {
      throw new Error(`Invalid filter: ${filter.column}`);
    }

    // Apply validated filter using Supabase's type-safe methods
    switch (filter.operator) {
      case "eq":
        query = query.eq(filter.column, filter.value);
        break;
      case "neq":
        query = query.neq(filter.column, filter.value);
        break;
      case "gt":
        query = query.gt(filter.column, filter.value);
        break;
      case "gte":
        query = query.gte(filter.column, filter.value);
        break;
      case "lt":
        query = query.lt(filter.column, filter.value);
        break;
      case "lte":
        query = query.lte(filter.column, filter.value);
        break;
      case "like":
        query = query.like(filter.column, filter.value);
        break;
      case "ilike":
        query = query.ilike(filter.column, filter.value);
        break;
      case "in":
        query = query.in(
          filter.column,
          Array.isArray(filter.value) ? filter.value : [filter.value],
        );
        break;
      case "is":
        query = query.is(filter.column, filter.value);
        break;
    }
  }
  return query;
}

// ============================================================================
// SAFE QUERY FUNCTIONS
// ============================================================================

/**
 * Safely fetch records from a table with validation
 */
export async function safeSelect(
  tableName: string,
  options: QueryOptions = {},
) {
  if (!validateTableName(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  let query = supabase.from(tableName).select(options.select || "*");

  // Apply validated filters
  if (options.filters && options.filters.length > 0) {
    query = applyFilters(query, options.filters);
  }

  // Apply ordering
  if (options.orderBy && options.orderBy.length > 0) {
    for (const order of options.orderBy) {
      if (!validateColumnName(order.column)) {
        throw new Error(`Invalid column name: ${order.column}`);
      }
      query = query.order(order.column, {
        ascending: order.ascending !== false,
      });
    }
  }

  // Apply pagination
  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(
      options.offset,
      (options.offset || 0) + (options.limit || 10) - 1,
    );
  }

  return query;
}

/**
 * Safely fetch a single record by ID
 */
export async function safeSelectById(
  tableName: string,
  id: string,
  idColumn: string = "id",
) {
  if (!validateTableName(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
  if (!validateColumnName(idColumn)) {
    throw new Error(`Invalid column name: ${idColumn}`);
  }

  // Validate ID format (UUID or numeric)
  if (!validateUUID(id) && !validateNumericId(id)) {
    throw new Error(`Invalid ID format: ${id}`);
  }

  const { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(idColumn, id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Safely insert a record
 */
export async function safeInsert(
  tableName: string,
  data: Record<string, unknown>,
) {
  if (!validateTableName(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  // Validate all column names
  for (const key in data) {
    if (!validateColumnName(key)) {
      throw new Error(`Invalid column name: ${key}`);
    }
  }

  const { data: result, error } = await supabase
    .from(tableName)
    .insert([data])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return result;
}

/**
 * Safely update a record
 */
export async function safeUpdate(
  tableName: string,
  id: string,
  data: Record<string, unknown>,
  idColumn: string = "id",
) {
  if (!validateTableName(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
  if (!validateColumnName(idColumn)) {
    throw new Error(`Invalid column name: ${idColumn}`);
  }

  // Validate ID format
  if (!validateUUID(id) && !validateNumericId(id)) {
    throw new Error(`Invalid ID format: ${id}`);
  }

  // Validate all column names
  for (const key in data) {
    if (!validateColumnName(key)) {
      throw new Error(`Invalid column name: ${key}`);
    }
  }

  const { data: result, error } = await supabase
    .from(tableName)
    .update(data)
    .eq(idColumn, id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return result;
}

/**
 * Safely delete a record
 */
export async function safeDelete(
  tableName: string,
  id: string,
  idColumn: string = "id",
) {
  if (!validateTableName(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
  if (!validateColumnName(idColumn)) {
    throw new Error(`Invalid column name: ${idColumn}`);
  }

  // Validate ID format
  if (!validateUUID(id) && !validateNumericId(id)) {
    throw new Error(`Invalid ID format: ${id}`);
  }

  const { error } = await supabase.from(tableName).delete().eq(idColumn, id);

  if (error) {
    throw error;
  }

  return true;
}

/**
 * Safely search for records with pattern matching
 * Prevents SQL injection by validating search patterns
 */
export async function safeSearch(
  tableName: string,
  searchColumns: string[],
  searchTerm: string,
  options: { limit?: number; offset?: number } = {},
) {
  if (!validateTableName(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  // Validate all search columns
  for (const column of searchColumns) {
    if (!validateColumnName(column)) {
      throw new Error(`Invalid column name: ${column}`);
    }
  }

  // Limit search term length to prevent abuse
  if (searchTerm.length > 100) {
    throw new Error("Search term too long (max 100 characters)");
  }

  // Escape special characters for ILIKE pattern matching
  const escapedTerm = searchTerm
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");

  let query = supabase.from(tableName).select("*");

  // Build OR query for multiple columns
  if (searchColumns.length === 1) {
    query = query.ilike(searchColumns[0], `%${escapedTerm}%`);
  } else {
    // Correctly build OR query for multiple columns
    const orQuery = searchColumns
      .map((col) => `${col}.ilike.%${escapedTerm}%`)
      .join(",");
    query = query.or(orQuery);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(
      options.offset,
      (options.offset || 0) + (options.limit || 10) - 1,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}
