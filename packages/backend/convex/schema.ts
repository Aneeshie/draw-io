import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        email: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
    }),

    rooms: defineTable({
        roomName: v.string(),
        ownerId: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    }),

    userRooms: defineTable({
        userId: v.id("users"),
        roomId: v.id("rooms"),
        joinedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_room", ["roomId"])
        .index("by_user_room", ["userId", "roomId"]),

    strokes: defineTable({
        roomId: v.id("rooms"),
        userId: v.id("users"),

        points: v.array(
            v.object({
                x: v.number(),
                y: v.number(),
            })
        ),

        color: v.string(),
        thickness: v.number(),
        tool: v.union(v.literal("pen"), v.literal("eraser")),

        createdAt: v.number(),
    })
        .index("by_room", ["roomId"])
        .index("by_room_created", ["roomId", "createdAt"])
        .index("by_room_user_created", ["roomId", "userId", "createdAt"]),
});
