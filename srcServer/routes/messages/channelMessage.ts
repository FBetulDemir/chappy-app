import express from "express";
import type { Router, Request, Response } from "express";
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, tableName } from "../../data/dynamoDb.js";
import crypto from "crypto";
import { validateJwt, requireUser } from "../../auth/validateJwt.js";
import type {
  ChannelIdParam,
  MessageBody,
  MessageResponse,
  Payload,
  ReceiverIdParam,
} from "../../data/types.js";

const router: Router = express.Router();

// const now = () => Math.floor(Date.now() / 1000);

async function getChannelLocked(channelId: string): Promise<boolean | null> {
  const result = await db.send(
    new GetCommand({
      TableName: tableName,
      Key: { PK: `CHANNEL#${channelId}`, SK: "META" },
    })
  );
  if (!result.Item) return null;
  return !!result.Item.locked;
}

async function getUsernameByUserId(
  userId?: string | null
): Promise<string | null> {
  if (!userId) return null;

  let r = await db.send(
    new GetCommand({
      TableName: tableName,
      Key: { PK: "USER", SK: `USER#${userId}` },
    })
  );
  if (r.Item?.username) return String(r.Item.username);

  r = await db.send(
    new GetCommand({
      TableName: tableName,
      Key: { PK: `USER#${userId}`, SK: "META" },
    })
  );
  if (r.Item?.username) return String(r.Item.username);

  return null;
}

//send message to a channel
router.post(
  "/channel",
  async (
    req: Request<{}, MessageResponse, MessageBody>,
    res: Response<MessageResponse>
  ) => {
    const { channelId, text } = req.body;

    if (!channelId || !text) {
      return res.status(400).json({
        success: false,
        message: "channelId and non-empty text required",
      });
    }
    const locked = await getChannelLocked(channelId);
    // Only require auth for locked channels
    const auth = locked ? requireUser(req, res) : null;
    if (locked && !auth) return;

    const messageId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    //With the helper function above, we can now get the username of the sender based on their userId from the JWT payload.
    const username =
      auth?.username ?? (await getUsernameByUserId(auth?.userId)) ?? "guest";

    await db.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          PK: `CHANNEL#${channelId}`,
          SK: `MSG#${createdAt}#${messageId}`,
          type: "Message",
          channelId,
          messageId,
          userId: auth?.userId ?? "guest",
          username,
          text: text.trim(),
          createdAt,
        },
      })
    );

    res.status(201).json({
      success: true,
      messageId,
      createdAt,
    });
  }
);

//get all messages in a channel
router.get(
  "/channel/:channelId",
  async (req: Request<ChannelIdParam, MessageBody>, res: Response) => {
    const { channelId } = req.params;

    //check channel, lock status
    const locked = await getChannelLocked(channelId);
    if (locked === null) {
      return res
        .status(404)
        .json({ success: false, message: "Channel not found" });
    }

    // require login (requireUser) only if locked
    if (locked) {
      const auth = requireUser(req, res);
      if (!auth) return;
      // requireUser already sent 401 login required response
    }

    //query all messages in this channel
    const output = await db.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `CHANNEL#${channelId}`,
          ":sk": "MSG#",
        },
      })
    );

    return res.json({
      success: true,
      locked,
      messages: output.Items ?? [],
      username: output.Items,
    });
  }
);

export default router;
