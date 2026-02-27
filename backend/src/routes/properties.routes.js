import express from "express";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client.js";
import { propertyLikes, properties, users } from "../db/schema.js";
import { optionalAuth } from "../middleware/optional-auth.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

const createPropertySchema = z
  .object({
    title: z.string().min(3),
    propertyType: z.enum(["hotel", "homestay", "hostel", "resort"]).default("hotel"),
    description: z.string().min(10),
    city: z.string().min(2),
    address: z.string().optional(),
    amenities: z.array(z.string().min(1)).max(30).default([]),
    roomCount: z.coerce.number().int().positive().default(1),
    availableRooms: z.coerce.number().int().nonnegative().default(1),
    checkInTime: z.string().regex(/^\d{2}:\d{2}$/).default("12:00"),
    checkOutTime: z.string().regex(/^\d{2}:\d{2}$/).default("11:00"),
    contactPhone: z.string().optional(),
    contactEmail: z.string().email().optional(),
    pricePerNight: z.coerce.number().int().positive(),
    imageUrl: z.string().url().optional(),
  })
  .refine((data) => data.availableRooms <= data.roomCount, {
    message: "Available rooms cannot exceed total rooms",
    path: ["availableRooms"],
  });

const mapPropertyRows = (rows, likeCountMap, likedPropertyIds) =>
  rows.map((row) => ({
    id: row.id,
    title: row.title,
    propertyType: row.propertyType,
    description: row.description,
    city: row.city,
    address: row.address,
    amenities: row.amenities || [],
    roomCount: row.roomCount,
    availableRooms: row.availableRooms,
    checkInTime: row.checkInTime,
    checkOutTime: row.checkOutTime,
    contactPhone: row.contactPhone,
    contactEmail: row.contactEmail,
    pricePerNight: row.pricePerNight,
    imageUrl: row.imageUrl,
    isApproved: row.isApproved,
    createdAt: row.createdAt,
    vendor: {
      id: row.vendorId,
      firstName: row.vendorFirstName,
      lastName: row.vendorLastName,
      email: row.vendorEmail,
    },
    likeCount: likeCountMap.get(row.id) || 0,
    likedByMe: likedPropertyIds.has(row.id),
  }));

router.get("/", optionalAuth, async (req, res) => {
  const approvedOnly = req.query.approvedOnly !== "false";

  const whereClause = approvedOnly ? eq(properties.isApproved, true) : undefined;
  const rows = await db
    .select({
      id: properties.id,
      vendorId: properties.vendorId,
      title: properties.title,
      propertyType: properties.propertyType,
      description: properties.description,
      city: properties.city,
      address: properties.address,
      amenities: properties.amenities,
      roomCount: properties.roomCount,
      availableRooms: properties.availableRooms,
      checkInTime: properties.checkInTime,
      checkOutTime: properties.checkOutTime,
      contactPhone: properties.contactPhone,
      contactEmail: properties.contactEmail,
      pricePerNight: properties.pricePerNight,
      imageUrl: properties.imageUrl,
      isApproved: properties.isApproved,
      createdAt: properties.createdAt,
      vendorFirstName: users.firstName,
      vendorLastName: users.lastName,
      vendorEmail: users.email,
    })
    .from(properties)
    .innerJoin(users, eq(users.id, properties.vendorId))
    .where(whereClause)
    .orderBy(desc(properties.createdAt));

  const propertyIds = rows.map((row) => row.id);
  if (propertyIds.length === 0) {
    return res.json({ properties: [] });
  }

  const likeCounts = await db
    .select({
      propertyId: propertyLikes.propertyId,
      likeCount: sql`count(*)::int`,
    })
    .from(propertyLikes)
    .where(inArray(propertyLikes.propertyId, propertyIds))
    .groupBy(propertyLikes.propertyId);

  const likeCountMap = new Map(likeCounts.map((row) => [row.propertyId, Number(row.likeCount)]));
  let likedPropertyIds = new Set();

  if (req.user?.sub) {
    const likedRows = await db
      .select({ propertyId: propertyLikes.propertyId })
      .from(propertyLikes)
      .where(and(eq(propertyLikes.userId, req.user.sub), inArray(propertyLikes.propertyId, propertyIds)));
    likedPropertyIds = new Set(likedRows.map((row) => row.propertyId));
  }

  return res.json({ properties: mapPropertyRows(rows, likeCountMap, likedPropertyIds) });
});

router.get("/mine", requireAuth, requireRole("vendor", "admin"), async (req, res) => {
  const rows = await db
    .select()
    .from(properties)
    .where(eq(properties.vendorId, req.user.sub))
    .orderBy(desc(properties.createdAt));

  return res.json({ properties: rows });
});

router.post("/", requireAuth, requireRole("vendor", "admin"), async (req, res) => {
  const parsed = createPropertySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid property payload", errors: parsed.error.flatten() });
  }

  const [created] = await db
    .insert(properties)
    .values({
      vendorId: req.user.sub,
      title: parsed.data.title,
      propertyType: parsed.data.propertyType,
      description: parsed.data.description,
      city: parsed.data.city,
      address: parsed.data.address,
      amenities: parsed.data.amenities,
      roomCount: parsed.data.roomCount,
      availableRooms: parsed.data.availableRooms,
      checkInTime: parsed.data.checkInTime,
      checkOutTime: parsed.data.checkOutTime,
      contactPhone: parsed.data.contactPhone,
      contactEmail: parsed.data.contactEmail,
      pricePerNight: parsed.data.pricePerNight,
      imageUrl: parsed.data.imageUrl,
      isApproved: req.user.role === "admin",
    })
    .returning();

  return res.status(201).json({ property: created });
});

router.post("/:propertyId/like", requireAuth, async (req, res) => {
  const propertyId = req.params.propertyId;

  const [property] = await db.select().from(properties).where(eq(properties.id, propertyId)).limit(1);
  if (!property || !property.isApproved) {
    return res.status(404).json({ message: "Property not found" });
  }

  await db
    .insert(propertyLikes)
    .values({
      propertyId,
      userId: req.user.sub,
    })
    .onConflictDoNothing();

  return res.status(201).json({ liked: true });
});

router.delete("/:propertyId/like", requireAuth, async (req, res) => {
  const propertyId = req.params.propertyId;

  await db
    .delete(propertyLikes)
    .where(and(eq(propertyLikes.propertyId, propertyId), eq(propertyLikes.userId, req.user.sub)));

  return res.json({ liked: false });
});

export default router;
