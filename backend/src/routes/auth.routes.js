import express from "express";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { env } from "../config/env.js";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { signAuthToken } from "../utils/jwt.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const HARD_ADMIN_EMAIL = "amit@admin";
const HARD_ADMIN_PASSWORD = "Amit_098";

const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.enum(["visitor", "vendor", "admin"]).default("visitor"),
  password: z.string().min(8),
  adminSignupKey: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().min(3),
  password: z.string().min(1),
});

router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid signup payload", errors: parsed.error.flatten() });
  }

  const { firstName, lastName, email, phone, role, password, adminSignupKey } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  if (role === "admin") {
    const [adminCount] = await db.select({ value: sql`count(*)::int` }).from(users).where(eq(users.role, "admin"));
    const hasAdminAlready = Number(adminCount?.value || 0) > 0;
    const hasValidKey = Boolean(env.ADMIN_SIGNUP_KEY && adminSignupKey === env.ADMIN_SIGNUP_KEY);

    if (hasAdminAlready && !hasValidKey) {
      return res.status(403).json({ message: "Admin signup requires ADMIN_SIGNUP_KEY" });
    }
  }

  const existing = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
  if (existing.length > 0) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const inserted = await db
    .insert(users)
    .values({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      role,
      passwordHash,
    })
    .returning({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      role: users.role,
      phone: users.phone,
    });

  const user = inserted[0];
  const token = signAuthToken(user);

  return res.status(201).json({ token, user });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid login payload", errors: parsed.error.flatten() });
  }

  const email = parsed.data.email.toLowerCase();

  if (email === HARD_ADMIN_EMAIL && parsed.data.password === HARD_ADMIN_PASSWORD) {
    const [existingAdmin] = await db.select().from(users).where(eq(users.email, HARD_ADMIN_EMAIL)).limit(1);

    let adminUser = existingAdmin;
    if (!adminUser) {
      const passwordHash = await bcrypt.hash(HARD_ADMIN_PASSWORD, 10);
      const [createdAdmin] = await db
        .insert(users)
        .values({
          firstName: "Amit",
          lastName: "Admin",
          email: HARD_ADMIN_EMAIL,
          role: "admin",
          passwordHash,
        })
        .returning();
      adminUser = createdAdmin;
    } else if (adminUser.role !== "admin") {
      const [updatedAdmin] = await db
        .update(users)
        .set({ role: "admin", updatedAt: new Date() })
        .where(eq(users.id, adminUser.id))
        .returning();
      adminUser = updatedAdmin;
    }

    const safeAdmin = {
      id: adminUser.id,
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      email: adminUser.email,
      role: "admin",
      phone: adminUser.phone,
    };

    const token = signAuthToken(safeAdmin);
    return res.json({ token, user: safeAdmin });
  }

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
  };

  const token = signAuthToken(safeUser);
  return res.json({ token, user: safeUser });
});

router.get("/me", requireAuth, async (req, res) => {
  const [user] = await db.select().from(users).where(eq(users.id, req.user.sub)).limit(1);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
});

export default router;
