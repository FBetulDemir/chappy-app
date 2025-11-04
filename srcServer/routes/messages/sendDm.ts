import express from "express";
import type { Router, Request, Response } from "express";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
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
