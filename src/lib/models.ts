/**
 * Centralized Mongoose model registration.
 *
 * Import this file in any server action or API route BEFORE running
 * queries that use populate(), so that all referenced models are
 * registered in Mongoose's model registry.
 *
 * The `mongoose.models.X || mongoose.model('X', XSchema)` pattern in each
 * individual model file is idempotent, so importing them multiple times is safe.
 */

// Order of imports matters when schemas reference each other via ref:
// 1. Leaf models (no outgoing refs) first
// 2. Models that ref the leaves second
// 3. Top-level models last

import '@/models/Category';
import '@/models/Collection';
import '@/models/Banner';
import '@/models/Blog';
import '@/models/Coupon';
import '@/models/Notification';
import '@/models/Settings';
import '@/models/Review';
import '@/models/User';
import '@/models/Product';   // refs Category
import '@/models/Order';     // refs User, Product

// Re-export default models for convenience
export { default as Category } from '@/models/Category';
export { default as Collection } from '@/models/Collection';
export { default as Banner } from '@/models/Banner';
export { default as Blog } from '@/models/Blog';
export { default as Coupon } from '@/models/Coupon';
export { default as Notification } from '@/models/Notification';
export { default as Settings } from '@/models/Settings';
export { default as Review } from '@/models/Review';
export { default as User } from '@/models/User';
export { default as Product } from '@/models/Product';
export { default as Order } from '@/models/Order';
