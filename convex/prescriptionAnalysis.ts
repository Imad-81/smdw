"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

export const analyzePrescription = action({
  args: {
    base64Image: v.string(),
    mimeType: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.2-90b-vision-preview",
          messages: [
            {
              role: "system",
              content: `You are a medical prescription analyzer for a college mess food delivery service. 
Your job is to extract dietary restrictions and food-related instructions from prescription images.

Analyze the uploaded prescription image and extract:
1. Any dietary restrictions mentioned (e.g., "avoid dairy", "bland food only", "no spicy food")
2. Any specific food instructions from the doctor
3. The date of the prescription if visible

Respond ONLY in valid JSON format with this exact structure:
{
  "dietaryFlags": ["flag1", "flag2"],
  "foodInstructions": "any specific food instructions",
  "prescriptionDate": "YYYY-MM-DD or null if not visible",
  "summary": "brief summary of findings",
  "confidence": "high" | "medium" | "low"
}

If you cannot read the prescription clearly, still return the JSON with what you can determine, and set confidence to "low".
Do not include any text outside the JSON.`,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Please analyze this prescription image and extract any dietary restrictions and food-related instructions.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${args.mimeType};base64,${args.base64Image}`,
                  },
                },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      // Return a fallback response instead of throwing
      return {
        dietaryFlags: [],
        foodInstructions: "",
        prescriptionDate: null,
        summary:
          "Could not analyze prescription. Please add dietary flags manually.",
        confidence: "low",
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        dietaryFlags: [],
        foodInstructions: "",
        prescriptionDate: null,
        summary: "No content returned from analysis.",
        confidence: "low",
      };
    }

    try {
      // Try to parse the JSON response
      const cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      return JSON.parse(cleanContent);
    } catch {
      // If parsing fails, return a structured fallback
      return {
        dietaryFlags: [],
        foodInstructions: content,
        prescriptionDate: null,
        summary: content.slice(0, 200),
        confidence: "low",
      };
    }
  },
});
