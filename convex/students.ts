import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get or create student profile from Clerk
export const getOrCreateStudent = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("students")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      return existing;
    }

    const studentId = await ctx.db.insert("students", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      role: "student",
      createdAt: Date.now(),
    });

    return await ctx.db.get(studentId);
  },
});

// Get student by Clerk ID
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Update student profile
export const updateProfile = mutation({
  args: {
    studentId: v.id("students"),
    phone: v.optional(v.string()),
    rollNumber: v.optional(v.string()),
    hostel: v.optional(v.string()),
    roomNumber: v.optional(v.string()),
    dietaryPreference: v.optional(
      v.union(
        v.literal("veg"),
        v.literal("non-veg"),
        v.literal("vegan"),
        v.literal("jain")
      )
    ),
    knownAllergies: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { studentId, ...fields } = args;
    await ctx.db.patch(studentId, fields);
  },
});

// Update student role (admin only)
export const updateRole = mutation({
  args: {
    studentId: v.id("students"),
    role: v.union(
      v.literal("student"),
      v.literal("warden"),
      v.literal("mess_staff"),
      v.literal("admin")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.studentId, { role: args.role });
  },
});

// List all students (for admin)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("students").collect();
  },
});
