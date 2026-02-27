import express from "express";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client.js";
import { properties, users } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/role.js";

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.get("/dashboard", async (req, res) => {
  const [userCount] = await db.select({ value: sql`count(*)::int` }).from(users);
  const [vendorCount] = await db.select({ value: sql`count(*)::int` }).from(users).where(eq(users.role, "vendor"));
  const [propertyCount] = await db.select({ value: sql`count(*)::int` }).from(properties);
  const [pendingCount] = await db
    .select({ value: sql`count(*)::int` })
    .from(properties)
    .where(eq(properties.isApproved, false));

  return res.json({
    totals: {
      users: Number(userCount?.value || 0),
      vendors: Number(vendorCount?.value || 0),
      properties: Number(propertyCount?.value || 0),
      pendingProperties: Number(pendingCount?.value || 0),
    },
  });
});

router.get("/users", async (req, res) => {
  const allUsers = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users);

  return res.json({ users: allUsers });
});

const updateUserRoleSchema = z.object({
  role: z.enum(["visitor", "vendor", "admin"]),
});

router.patch("/users/:userId/role", async (req, res) => {
  const parsed = updateUserRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid role payload", errors: parsed.error.flatten() });
  }

  const [updated] = await db
    .update(users)
    .set({
      role: parsed.data.role,
      updatedAt: new Date(),
    })
    .where(eq(users.id, req.params.userId))
    .returning({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      email: users.email,
    });

  if (!updated) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user: updated });
});

router.get("/properties", async (req, res) => {
  const allProperties = await db
    .select({
      id: properties.id,
      title: properties.title,
      city: properties.city,
      isApproved: properties.isApproved,
      pricePerNight: properties.pricePerNight,
      vendorId: properties.vendorId,
      createdAt: properties.createdAt,
    })
    .from(properties);

  return res.json({ properties: allProperties });
});

const approvalSchema = z.object({
  isApproved: z.boolean(),
});

router.patch("/properties/:propertyId/approval", async (req, res) => {
  const parsed = approvalSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid approval payload", errors: parsed.error.flatten() });
  }

  const [updated] = await db
    .update(properties)
    .set({
      isApproved: parsed.data.isApproved,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, req.params.propertyId))
    .returning();

  if (!updated) {
    return res.status(404).json({ message: "Property not found" });
  }

  return res.json({ property: updated });
});

router.delete("/properties/:propertyId", async (req, res) => {
  const [deleted] = await db
    .delete(properties)
    .where(eq(properties.id, req.params.propertyId))
    .returning({ id: properties.id });

  if (!deleted) {
    return res.status(404).json({ message: "Property not found" });
  }

  return res.json({ deleted: true, propertyId: deleted.id });
});

export default router;
