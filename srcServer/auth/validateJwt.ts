import jwt from "jsonwebtoken";
import type { Payload } from "../data/types.js";
import type { Request, Response } from "express";

export function validateJwt(authHeader: string | undefined): Payload | null {
  //it looks like 'Bearer: token'
  if (!authHeader) {
    return null;
  }
  const token: string = authHeader.substring(7);

  try {
    const decodedPayload: Payload = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as Payload;

    // validate decodedPayload
    const payload: Payload = {
      userId: decodedPayload.userId,
      accessLevel: decodedPayload.accessLevel,
      username: decodedPayload.username,
    };
    return payload;
  } catch (error) {
    console.log("JWT verify failed: ", (error as any)?.message);
    return null;
  }
}

// Helper function to require user authentication in Express routes
export function requireUser(req: Request<any>, res: Response): Payload | null {
  const payload = validateJwt(req.headers["authorization"]);
  if (!payload) {
    res.status(401).json({ error: "Login required" });
    return null;
  }
  return payload;
}
