import express from "express";
import { z } from "zod";
import { searchFlights, searchTrains } from "../services/search.service.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

const flightsQuerySchema = z.object({
  from: z.string().min(3),
  to: z.string().min(3),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const trainQuerySchema = z.object({
  from: z.string().min(2),
  to: z.string().min(2),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
});

router.get("/flights", async (req, res) => {
  const parsed = flightsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid flight search query", errors: parsed.error.flatten() });
  }

  try {
    const data = await searchFlights(parsed.data);
    return res.json(data);
  } catch (error) {
    return res.status(502).json({ message: "Flight provider unavailable", details: error.message });
  }
});

router.get("/trains", async (req, res) => {
  const parsed = trainQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid train search query", errors: parsed.error.flatten() });
  }

  try {
    const data = await searchTrains(parsed.data);
    return res.json(data);
  } catch (error) {
    return res.status(502).json({ message: "Train provider unavailable", details: error.message });
  }
});

export default router;
