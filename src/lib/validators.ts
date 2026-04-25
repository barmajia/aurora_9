import { z } from 'zod';

/**
 * Zod Validation Schemas for Aurora E-Commerce
 * Comprehensive input validation for all forms and API endpoints
 */

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

// ============================================================================
// PRODUCT SCHEMAS
// ============================================================================

export const productCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  price: z.number().positive('Price must be positive').max(999999),
  category: z.string().min(1, 'Category is required').max(100),
  brand: z.string().optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  tags: z.array(z.string().max(50)).optional(),
  specifications: z.record(z.string()).optional(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const productQuerySchema = z.object({
  search: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'popular']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

// ============================================================================
// ORDER SCHEMAS
// ============================================================================

export const orderCreateSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be positive').max(100),
    configuration: z.string().optional(),
  })).min(1, 'At least one item is required'),
  shippingAddress: z.object({
    fullName: z.string().min(2, 'Full name is required').max(200),
    addressLine1: z.string().min(5, 'Address is required').max(500),
    addressLine2: z.string().max(500).optional(),
    city: z.string().min(2, 'City is required').max(200),
    state: z.string().min(2, 'State is required').max(200),
    postalCode: z.string().min(5, 'Postal code is required').max(20),
    country: z.string().length(2, 'Country code must be 2 characters'),
    phone: z.string().min(10, 'Phone number is required').max(20),
  }),
  billingAddress: z.object({
    fullName: z.string().min(2, 'Full name is required').max(200),
    addressLine1: z.string().min(5, 'Address is required').max(500),
    addressLine2: z.string().max(500).optional(),
    city: z.string().min(2, 'City is required').max(200),
    state: z.string().min(2, 'State is required').max(200),
    postalCode: z.string().min(5, 'Postal code is required').max(20),
    country: z.string().length(2, 'Country code must be 2 characters'),
    phone: z.string().min(10, 'Phone number is required').max(20),
  }).optional(),
  paymentMethod: z.enum(['card', 'paypal', 'bank_transfer']),
});

export const orderQuerySchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  search: z.string().max(100).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

// ============================================================================
// USER PROFILE SCHEMAS
// ============================================================================

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20).optional(),
  bio: z.string().max(500).optional(),
  preferences: z.object({
    newsletter: z.boolean().optional(),
    notifications: z.boolean().optional(),
    language: z.string().max(10).optional(),
    currency: z.string().length(3).optional(),
  }).optional(),
});

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50),
  fullName: z.string().min(2, 'Full name is required').max(200),
  addressLine1: z.string().min(5, 'Address is required').max(500),
  addressLine2: z.string().max(500).optional(),
  city: z.string().min(2, 'City is required').max(200),
  state: z.string().min(2, 'State is required').max(200),
  postalCode: z.string().min(5, 'Postal code is required').max(20),
  country: z.string().length(2, 'Country code must be 2 characters'),
  phone: z.string().min(10, 'Phone number is required').max(20),
  isDefault: z.boolean().optional(),
});

// ============================================================================
// REVIEW SCHEMAS
// ============================================================================

export const reviewCreateSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  content: z.string().min(20, 'Review must be at least 20 characters').max(2000),
  recommend: z.boolean().optional(),
});

export const reviewUpdateSchema = reviewCreateSchema.partial();

// ============================================================================
// FILE UPLOAD SCHEMAS
// ============================================================================

export const fileUploadSchema = z.object({
  filename: z.string().max(255),
  mimetype: z.string().refine(
    (type) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'].includes(type),
    'Invalid file type'
  ),
  size: z.number().int().positive().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
});

// ============================================================================
// CONTACT/FEEDBACK SCHEMAS
// ============================================================================

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  email: z.string().email('Invalid email address').max(254),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(500),
  message: z.string().min(20, 'Message must be at least 20 characters').max(5000),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
});

// ============================================================================
// EXPORT TYPE INFERENCES
// ============================================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
