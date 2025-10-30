import jwt from "jsonwebtoken";
import type { Payload } from "../data/types.js";

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
    };
    return payload;
  } catch (error) {
    console.log("JWT verify failed: ", (error as any)?.message);
    return null;
  }
}
