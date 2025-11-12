import express from "express";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../../data/dynamoDb.js";

const router: Router = express.Router();

//get all the channels
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await db.send(
      new ScanCommand({
        TableName: tableName,
        FilterExpression: "begins_with(PK, :pk) AND SK = :meta",
        ExpressionAttributeValues: {
          ":pk": "CHANNEL#",
          ":meta": "META",
        },
        ProjectionExpression:
          "PK, SK, channelId, #n, locked, ownerId, ownerName",
        ExpressionAttributeNames: { "#n": "name" },
      })
    );

    res.json(result.Items || []);
  } catch (err) {
    console.error("Error fetching channels:", err);
    res.status(500).json({ error: "Failed to fetch channels" });
  }
});

export default router;
