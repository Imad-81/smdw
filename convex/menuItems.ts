import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all menu items
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("menuItems").collect();
  },
});

// Get menu items by meal slot
export const getBySlot = query({
  args: {
    slot: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner")
    ),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db.query("menuItems").collect();
    return items.filter(
      (item) =>
        item.availableForSickDelivery && item.mealSlot.includes(args.slot)
    );
  },
});

// Add menu item
export const add = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("menuItems", args);
  },
});

// Seed menu items
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("menuItems").first();
    if (existing) return "already seeded";

    const items = [
      // Breakfast items
      {
        name: "Plain Upma",
        description: "Light semolina dish with mild vegetables",
        dietaryTags: ["veg"] as const,
        spiceLevel: "low" as const,
        recommendedFor: ["fever_flu", "general_weakness"],
        discouragedFor: [],
        availableForSickDelivery: true,
        mealSlot: ["breakfast"] as const,
        category: "breakfast",
      },
      {
        name: "Banana",
        description: "Fresh ripe banana",
        dietaryTags: ["veg", "vegan", "jain"] as const,
        spiceLevel: "none" as const,
        recommendedFor: ["fever_flu", "stomach_infection", "general_weakness"],
        discouragedFor: [],
        availableForSickDelivery: true,
        mealSlot: ["breakfast", "lunch", "dinner"] as const,
        category: "fruit",
      },
      {
        name: "Warm Milk",
        description: "Warm milk with optional turmeric",
        dietaryTags: ["veg"] as const,
        spiceLevel: "none" as const,
        recommendedFor: ["fever_flu", "throat_infection", "general_weakness"],
        discouragedFor: ["stomach_infection"],
        availableForSickDelivery: true,
        mealSlot: ["breakfast", "dinner"] as const,
        category: "beverage",
      },
      {
        name: "Plain Toast",
        description: "Lightly toasted white bread",
        dietaryTags: ["veg", "vegan"] as const,
        allergens: ["gluten"],
        spiceLevel: "none" as const,
        recommendedFor: ["stomach_infection", "recovery"],
        discouragedFor: [],
        availableForSickDelivery: true,
        mealSlot: ["breakfast"] as const,
        category: "breakfast",
      },
      {
        name: "Warm Porridge",
        description: "Soft, warm oats porridge",
        dietaryTags: ["veg"] as const,
        allergens: ["gluten"],
        spiceLevel: "none" as const,
        recommendedFor: ["throat_infection", "general_weakness"],
        discouragedFor: [],
        availableForSickDelivery: true,
        mealSlot: ["breakfast"] as const,
        category: "breakfast",
      },
      {
        name: "Boiled Eggs",
        description: "Two soft-boiled eggs",
        dietaryTags: ["non-veg"] as const,
        allergens: ["eggs"],
        spiceLevel: "none" as const,
        recommendedFor: ["recovery", "injury"],
        discouragedFor: [],
        availableForSickDelivery: true,
        mealSlot: ["breakfast", "lunch"] as const,
        category: "protein",
      },
      // Lunch items
      {
        name: "Khichdi",
        description: "Light rice and lentil porridge with mild spices",
        dietaryTags: ["veg", "vegan"] as const,
        spiceLevel: "low" as const,
        recommendedFor: [
          "fever_flu",
          "throat_infection",
          "general_weakness",
          "stomach_infection",
        ],
        discouragedFor: [],
        availableForSickDelivery: true,
        mealSlot: ["lunch", "dinner"] as const,
        category: "main",
      },
      {
        name: "Plain Dal",
        description: "Simple lentil soup with mild seasoning",
        dietaryTags: ["veg", "vegan"] as const,
        spiceLevel: "low" as const,
        recommendedFor: ["fever_flu", "recovery", "general_weakness"],
        discouragedFor: ["stomach_infection"],
        availableForSickDelivery: true,
        mealSlot: ["lunch", "dinner"] as const,
        category: "main",
      },
      {
        name: "Soft Rice",
        description: "Well-cooked soft steamed rice",
        dietaryTags: ["veg", "vegan", "jain"] as const,
        spiceLevel: "none" as const,
        recommendedFor: [
          "fever_flu",
          "stomach_infection",
          "recovery",
          "general_weakness",
        ],
        discouragedFor: [],
        availableForSickDelivery: true,
        mealSlot: ["lunch", "dinner"] as const,
        category: "main",
      },
      {
        name: "Curd / Yogurt",
        description: "Fresh plain yogurt",
        dietaryTags: ["veg"] as const,
        allergens: ["dairy"],
        spiceLevel: "none" as const,
        recommendedFor: ["fever_flu", "stomach_infection", "general_weakness"],
        discouragedFor: ["throat_infection"],
        availableForSickDelivery: true,
        mealSlot: ["lunch", "dinner"] as const,
        category: "side",
      },
      {
        name: "Clear Vegetable Soup",
        description: "Light and warm clear broth with vegetables",
        dietaryTags: ["veg", "vegan"] as const,
        spiceLevel: "none" as const,
        recommendedFor: ["fever_flu", "throat_infection"],
        discouragedFor: [],
        availableForSickDelivery: true,
        mealSlot: ["lunch", "dinner"] as const,
        category: "soup",
      },
      {
        name: "Curd Rice",
        description: "Rice mixed with cool yogurt",
        dietaryTags: ["veg"] as const,
        allergens: ["dairy"],
        spiceLevel: "none" as const,
        recommendedFor: ["stomach_infection"],
        discouragedFor: ["throat_infection"],
        availableForSickDelivery: true,
        mealSlot: ["lunch"] as const,
        category: "main",
      },
      {
        name: "Steamed Vegetables",
        description: "Lightly steamed mixed vegetables",
        dietaryTags: ["veg", "vegan", "jain"] as const,
        spiceLevel: "none" as const,
        recommendedFor: ["recovery", "general_weakness"],
        discouragedFor: [],
        availableForSickDelivery: true,
        mealSlot: ["lunch", "dinner"] as const,
        category: "side",
      },
      {
        name: "Soft Paneer",
        description: "Lightly cooked cottage cheese",
        dietaryTags: ["veg"] as const,
        allergens: ["dairy"],
        spiceLevel: "low" as const,
        recommendedFor: ["recovery"],
        discouragedFor: ["stomach_infection"],
        availableForSickDelivery: true,
        mealSlot: ["lunch", "dinner"] as const,
        category: "protein",
      },
      {
        name: "Boiled Potato",
        description: "Simple boiled potato",
        dietaryTags: ["veg", "vegan", "jain"] as const,
        spiceLevel: "none" as const,
        recommendedFor: ["stomach_infection"],
        discouragedFor: [],
        availableForSickDelivery: true,
        mealSlot: ["lunch", "dinner"] as const,
        category: "side",
      },
      // Items that should be marked as discouraged for certain illness types
      {
        name: "Spicy Curry",
        description: "Regular mess curry with spices",
        dietaryTags: ["veg"] as const,
        spiceLevel: "high" as const,
        recommendedFor: [],
        discouragedFor: [
          "fever_flu",
          "stomach_infection",
          "throat_infection",
          "general_weakness",
        ],
        availableForSickDelivery: true,
        mealSlot: ["lunch", "dinner"] as const,
        category: "main",
      },
      {
        name: "Fried Pakoda",
        description: "Deep-fried vegetable fritters",
        dietaryTags: ["veg"] as const,
        spiceLevel: "medium" as const,
        recommendedFor: [],
        discouragedFor: [
          "fever_flu",
          "stomach_infection",
          "recovery",
          "general_weakness",
        ],
        availableForSickDelivery: true,
        mealSlot: ["lunch", "dinner"] as const,
        category: "snack",
      },
      {
        name: "Honey-Turmeric Milk",
        description: "Warm milk with turmeric and honey",
        dietaryTags: ["veg"] as const,
        allergens: ["dairy"],
        spiceLevel: "none" as const,
        recommendedFor: ["throat_infection", "fever_flu"],
        discouragedFor: ["stomach_infection"],
        availableForSickDelivery: true,
        mealSlot: ["breakfast", "dinner"] as const,
        category: "beverage",
      },
      {
        name: "Fresh Fruit Bowl",
        description: "Assorted fresh fruits - apple, banana, papaya",
        dietaryTags: ["veg", "vegan", "jain"] as const,
        spiceLevel: "none" as const,
        recommendedFor: ["recovery", "general_weakness", "injury"],
        discouragedFor: [],
        availableForSickDelivery: true,
        mealSlot: ["breakfast", "lunch", "dinner"] as const,
        category: "fruit",
      },
      {
        name: "ORS Solution",
        description: "Oral Rehydration Salt solution",
        dietaryTags: ["veg", "vegan", "jain"] as const,
        spiceLevel: "none" as const,
        recommendedFor: ["stomach_infection", "fever_flu"],
        discouragedFor: [],
        availableForSickDelivery: true,
        mealSlot: ["breakfast", "lunch", "dinner"] as const,
        category: "beverage",
      },
    ];

    for (const item of items) {
      await ctx.db.insert("menuItems", {
        ...item,
        dietaryTags: [...item.dietaryTags],
        mealSlot: [...item.mealSlot],
      });
    }

    return "seeded";
  },
});
