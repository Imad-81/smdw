import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Generate a human-readable order ID
function generateOrderId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");
  return `MC-${year}-${random}`;
}

// Create a new order
export const create = mutation({
  args: {
    studentId: v.id("students"),
    studentName: v.string(),
    hostel: v.optional(v.string()),
    roomNumber: v.optional(v.string()),
    deliverySlot: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner")
    ),
    illnessType: v.string(),
    illnessSeverity: v.union(
      v.literal("mild"),
      v.literal("moderate"),
      v.literal("severe")
    ),
    illnessNotes: v.optional(v.string()),
    selectedItems: v.array(v.id("menuItems")),
    selectedItemNames: v.array(v.string()),
    specialInstructions: v.optional(v.string()),
    prescriptionStorageId: v.optional(v.id("_storage")),
    prescriptionStatus: v.union(
      v.literal("pending"),
      v.literal("verified"),
      v.literal("flagged"),
      v.literal("self_certified")
    ),
    ocrFlags: v.optional(v.array(v.string())),
    ocrRawText: v.optional(v.string()),
    studentAcknowledgedOverride: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const orderId = generateOrderId();

    const id = await ctx.db.insert("orders", {
      ...args,
      orderId,
      orderStatus: "pending_review",
      statusHistory: [
        {
          status: "submitted",
          timestamp: now,
          actor: args.studentName,
        },
        {
          status: "pending_review",
          timestamp: now,
          actor: "system",
        },
      ],
      createdAt: now,
      updatedAt: now,
    });

    return { id, orderId };
  },
});

// Get orders by student
export const getByStudent = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
      .order("desc")
      .collect();
  },
});

// Get all orders (for warden/admin)
export const getAll = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("orders").order("desc");
    const orders = await q.collect();
    if (args.status) {
      return orders.filter((o) => o.orderStatus === args.status);
    }
    return orders;
  },
});

// Get pending orders (for warden)
export const getPending = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_orderStatus", (q) => q.eq("orderStatus", "pending_review"))
      .order("desc")
      .collect();
    return orders;
  },
});

// Get approved orders (for mess staff)
export const getApproved = query({
  args: {},
  handler: async (ctx) => {
    const allOrders = await ctx.db.query("orders").order("desc").collect();
    return allOrders.filter(
      (o) =>
        o.orderStatus === "approved" ||
        o.orderStatus === "preparing" ||
        o.orderStatus === "dispatched"
    );
  },
});

// Approve order (warden)
export const approve = mutation({
  args: {
    orderId: v.id("orders"),
    wardenNotes: v.optional(v.string()),
    actorName: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    await ctx.db.patch(args.orderId, {
      orderStatus: "approved",
      wardenNotes: args.wardenNotes,
      statusHistory: [
        ...order.statusHistory,
        {
          status: "approved",
          timestamp: Date.now(),
          actor: args.actorName,
        },
      ],
      updatedAt: Date.now(),
    });
  },
});

// Reject order (warden)
export const reject = mutation({
  args: {
    orderId: v.id("orders"),
    rejectionReason: v.string(),
    actorName: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    await ctx.db.patch(args.orderId, {
      orderStatus: "rejected",
      rejectionReason: args.rejectionReason,
      statusHistory: [
        ...order.statusHistory,
        {
          status: "rejected",
          timestamp: Date.now(),
          actor: args.actorName,
        },
      ],
      updatedAt: Date.now(),
    });
  },
});

// Update order status (mess staff)
export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("preparing"),
      v.literal("dispatched"),
      v.literal("delivered")
    ),
    actorName: v.string(),
    kitchenNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const updates: Record<string, unknown> = {
      orderStatus: args.status,
      statusHistory: [
        ...order.statusHistory,
        {
          status: args.status,
          timestamp: Date.now(),
          actor: args.actorName,
        },
      ],
      updatedAt: Date.now(),
    };

    if (args.kitchenNotes) {
      updates.kitchenNotes = args.kitchenNotes;
    }

    await ctx.db.patch(args.orderId, updates);
  },
});

// Cancel order (student)
export const cancel = mutation({
  args: {
    orderId: v.id("orders"),
    actorName: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    if (
      order.orderStatus === "preparing" ||
      order.orderStatus === "dispatched" ||
      order.orderStatus === "delivered"
    ) {
      throw new Error("Cannot cancel order in current status");
    }

    await ctx.db.patch(args.orderId, {
      orderStatus: "cancelled",
      statusHistory: [
        ...order.statusHistory,
        {
          status: "cancelled",
          timestamp: Date.now(),
          actor: args.actorName,
        },
      ],
      updatedAt: Date.now(),
    });
  },
});

// Get single order
export const getById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

// Generate upload URL for prescriptions
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Get prescription URL
export const getPrescriptionUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
