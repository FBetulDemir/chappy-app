import express from "express";
import type { Router, Request, Response } from "express";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db, tableName } from "../../data/dynamoDb.js";
import type {
  RegisterBody,
  RegisterResponse,
  UserBody,
} from "../../data/types.js";
import { genSalt, hash } from "bcrypt";
import { createToken } from "../../auth/auth.js";
import crypto from "crypto";

const router: Router = express.Router();

router.post(
  "/",
  async (
    req: Request<{}, RegisterResponse, RegisterBody>,
    res: Response<RegisterResponse>
  ) => {
    const body = req.body;
    console.log("body", body);

    const newId = crypto.randomUUID();

    const salt: string = await genSalt();
    const hashed: string = await hash(body.password, salt);

    const command = new PutCommand({
      TableName: tableName,
      Item: {
        username: body.username,
        password: hashed,
        description: "Registered user; can join locked channels and send DMs",
        accessLevel: "user",
        PK: "USER",
        SK: "USER#" + newId,
      },
    });
    try {
      const result = await db.send(command);
      const token: string | null = createToken(newId);
      res.send({ success: true, token: token });
    } catch (error) {
      console.log(`registerUser.ts fel:`, (error as any)?.message);
      res.status(500).send({ success: false });
    }
  }
);

export default router;
