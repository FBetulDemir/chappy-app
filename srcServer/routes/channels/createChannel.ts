import express from "express";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../../data/dynamoDb.js";
import crypto from "crypto";
import type { Payload } from "../../data/types.js";
import { validateJwt } from "../../auth/validateJwt.js";

const router: Router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { name, locked } = req.body;

  //userId comes from the function validateJwt() that checks token from the request to see if the user have authorization to create a channel

  const maybePayload: Payload | null = validateJwt(
    req.headers["authorization"]
  );
  if (!maybePayload) {
    console.log("Validation of JWT failed");
    res.sendStatus(401);
    return;
  }

  const ownerId = maybePayload.userId;

  if (!ownerId) {
    return res.status(400).json({ success: false, message: "Missing ownerId" });
  }

  const channelId = crypto.randomUUID();

  const result = new PutCommand({
    TableName: tableName,
    Item: {
      PK: `CHANNEL#${channelId}`,
      SK: "META",
      channelId,
      name,
      type: "Channel",
      locked: !!locked,
      ownerId,
      createdAt: new Date().toISOString(),
      description: locked
        ? "Private channel — visible only to logged-in users"
        : "Public channel — visible to everyone",
    },
  });

  try {
    await db.send(result);
    res.status(201).json({
      success: true,
      message: `Channel '${name}' created`,
      channelId,
    });
  } catch (error) {
    console.error("Error creating channel:", error);
    res.status(500).json({ success: false, error: "Failed to create channel" });
  }
});

export default router;
