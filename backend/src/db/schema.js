import { boolean, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("visitor"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  propertyType: text("property_type").notNull().default("hotel"),
  description: text("description").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  amenities: text("amenities").array().notNull().default([]),
  roomCount: integer("room_count").notNull().default(1),
  availableRooms: integer("available_rooms").notNull().default(1),
  checkInTime: text("check_in_time").notNull().default("12:00"),
  checkOutTime: text("check_out_time").notNull().default("11:00"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  pricePerNight: integer("price_per_night").notNull(),
  imageUrl: text("image_url"),
  isApproved: boolean("is_approved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const propertyLikes = pgTable(
  "property_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("property_likes_unique").on(table.propertyId, table.userId)],
);
