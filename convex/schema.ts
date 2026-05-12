import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  students: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
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
    role: v.union(
      v.literal("student"),
      v.literal("warden"),
      v.literal("mess_staff"),
      v.literal("admin")
    ),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_role", ["role"])
    .index("by_hostel", ["hostel"]),

  orders: defineTable({
    orderId: v.string(),
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
    orderStatus: v.union(
      v.literal("submitted"),
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("preparing"),
      v.literal("dispatched"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    statusHistory: v.array(
      v.object({
        status: v.string(),
        timestamp: v.number(),
        actor: v.optional(v.string()),
      })
    ),
    wardenNotes: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    kitchenNotes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_studentId", ["studentId"])
    .index("by_orderStatus", ["orderStatus"])
    .index("by_hostel", ["hostel"])
    .index("by_deliverySlot", ["deliverySlot"])
    .index("by_createdAt", ["createdAt"]),

  menuItems: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    dietaryTags: v.array(
      v.union(
        v.literal("veg"),
        v.literal("non-veg"),
        v.literal("vegan"),
        v.literal("jain")
      )
    ),
    allergens: v.optional(v.array(v.string())),
    spiceLevel: v.union(
      v.literal("none"),
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    recommendedFor: v.array(v.string()),
    discouragedFor: v.array(v.string()),
    availableForSickDelivery: v.boolean(),
    mealSlot: v.array(
      v.union(
        v.literal("breakfast"),
        v.literal("lunch"),
        v.literal("dinner")
      )
    ),
    category: v.optional(v.string()),
  }).index("by_mealSlot", ["availableForSickDelivery"]),

  orderTemplates: defineTable({
    studentId: v.id("students"),
    name: v.string(),
    illnessType: v.string(),
    selectedItems: v.array(v.id("menuItems")),
    specialInstructions: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_studentId", ["studentId"]),
});
