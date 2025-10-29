import express from "express";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../../data/dynamoDb.js";
import crypto from "crypto";

const router: Router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { name, locked } = req.body;
  //user will come from a function that checks token from the request to see if the user have authorization to create
  //const ownerUserId = user.userId;
  const ownerId = req.params.userId;

  if (!name || !ownerId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing name or ownerId" });
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
