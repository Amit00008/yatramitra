import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signAuthToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const verifyAuthToken = (token) => jwt.verify(token, env.JWT_SECRET);
