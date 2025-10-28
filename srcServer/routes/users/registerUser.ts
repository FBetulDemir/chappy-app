import express from "express";
import type { Router, Request, Response } from "express";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { db, tableName } from "../../data/dynamoDb.js";
import type {
  RegisterBody,
  RegisterResponse,
  UserBody,
  UserItem,
} from "../../data/types.js";
import { genSalt, hash } from "bcrypt";
import { createToken } from "../../auth/auth.js";
import crypto from "crypto";

import { registerSchema } from "../../validation/validation.js";

const router: Router = express.Router();

router.post(
  "/",
  async (
    req: Request<{}, RegisterResponse, RegisterBody>,
    res: Response<RegisterResponse>
  ) => {
    const body = registerSchema.safeParse(req.body);
    // console.log("body", body);

    if (!body.success) {
      return res.status(400).send({
        success: false,
        message: body.error.message || "Invalid input",
      });
    }

    const { username, password, email } = body.data;
    const usernameLower = username.trim().toLowerCase();

    // Check if username already exists
    // Using Scan
    const existing = await db.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: "#pk = :pk AND #uname = :uname",
        ExpressionAttributeNames: {
          "#pk": "PK",
          "#uname": "usernameLower",
        },
        ExpressionAttributeValues: {
          ":pk": "USER",
          ":uname": usernameLower,
        },
      })
    );

    if (existing.Items && existing.Items.length > 0) {
      // if username already taken
      return res.status(409).send({
        success: false,
        message: "User already exists!",
      });
    }

    const newId = crypto.randomUUID();

    const salt: string = await genSalt();
    const hashed: string = await hash(password, salt);

    const command = new PutCommand({
      TableName: tableName,
      Item: {
        username,
        usernameLower,
        password: hashed,
        email: email,
        description: "Registered user; can join locked channels and send DMs",
        accessLevel: "user",
        PK: "USER",
        SK: "USER#" + newId,
      },
    });
    try {
      await db.send(command);
      const token: string | null = createToken(newId);
      res.send({ success: true, token: token });
    } catch (error) {
      console.log(`registerUser.ts fel:`, (error as any)?.message);
      res.status(500).send({ success: false, message: "Server error" });
    }
  }
);

export default router;
