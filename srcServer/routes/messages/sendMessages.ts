import express from "express";
import type { Router, Request, Response } from "express";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, tableName } from "../../data/dynamoDb.js";
import crypto from "crypto";
import { validateJwt, requireUser } from "../../auth/validateJwt.js";
import type {
  MessageBody,
  MessageResponse,
  Payload,
  ReceiverIdParam,
} from "../../data/types.js";

const router: Router = express.Router();

function nowISO() {
  return new Date().toISOString();
}

//send message to a channel
router.post(
  "/",
  async (
    req: Request<{}, MessageResponse, MessageBody>,
    res: Response<MessageResponse>
  ) => {
    const auth = requireUser(req, res);
    if (!auth) return;
    const { channelId, text } = req.body;

    if (!channelId || !text) {
      return res.status(400).json({
        success: false,
        message: "channelId and non-empty text required",
      });
    }

    const messageId = crypto.randomUUID();
    const createdAt = nowISO();

    await db.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          PK: `CHANNEL#${channelId}`,
          SK: `MSG#${createdAt}#${messageId}`,
          type: "Message",
          channelId,
          messageId,
          userId: auth.userId,
          text: text.trim(),
          createdAt,
        },
      })
    );

    res.status(201).json({ success: true, messageId, createdAt });
  }
);

//send message to a user (DM)
router.post(
  "/dm/:receiverId",
  async (
    req: Request<ReceiverIdParam, MessageResponse, MessageBody>,
    res: Response<MessageResponse>
  ) => {
    const auth = requireUser(req, res);
    if (!auth) return;

    const { receiverId } = req.params;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Text required" });
    }

    const messageId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await db.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          PK: `USER#${auth.userId}`,
          SK: `DM#${receiverId}#${createdAt}#${messageId}`,
          type: "DM",
          senderId: auth.userId,
          receiverId,
          text: text.trim(),
          createdAt,
        },
      })
    );

    res.status(201).json({ success: true, messageId, createdAt });
  }
);

export default router;
