import { verifyAuthToken } from "../utils/jwt.js";

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next();
  }

  try {
    req.user = verifyAuthToken(token);
    return next();
  } catch {
    return next();
  }
};
