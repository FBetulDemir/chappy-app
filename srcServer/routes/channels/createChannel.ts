import express from "express";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../../data/dynamoDb.js";

const router: Router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { channelId, name, locked } = req.body;
  //user will come from a function that checks token from the request to see if the user have authorization to create
  //const ownerUserId = user.userId;

  const result = await db.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        PK: `CHANNEL#${channelId}`,
        SK: "META",
        channelId,
        name,
        locked,
        //ownerUserId,
        createdAt: new Date().toISOString(),
      },
    })
  );

  //   try {
  //   } catch {}
});

export default router;
