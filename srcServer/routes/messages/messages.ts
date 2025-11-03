import express from "express";
import type { Router, Request, Response } from "express";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, tableName } from "../../data/dynamoDb.js";
import { validateJwt, requireUser } from "../../auth/validateJwt.js";
import type {
  MessageBody,
  MessageResponse,
  Payload,
  ReceiverIdParam,
  WithUserIdParam,
} from "../../data/types.js";

const router: Router = express.Router();

// LIST DM all DMs of a user (auth user - withUserId)
router.get(
  "/dm/:withUserId",
  async (req: Request<WithUserIdParam>, res: Response) => {
    const auth = requireUser(req, res);
    if (!auth) return;

    const { withUserId } = req.params;

    const out = await db.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": `USER#${auth.userId}`,
          ":sk": `DM#${withUserId}#`,
        },
      })
    );

    res.json(out.Items ?? []);
  }
);

export default router;
