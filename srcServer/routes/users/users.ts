import express from "express";
import type { Router, Request, Response } from "express";
import { db, tableName } from "../../data/dynamoDb.js";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { UserResponse } from "../../data/types.js";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response<void | UserResponse[]>) => {
  try {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: { "#pk": "PK" },
      ExpressionAttributeValues: {
        ":pk": "USER",
      },
    });

    const output = await db.send(command);

    if (!output.Items) {
      res.status(500).send();
      return;
    }

    const users = output.Items.map((item: any) => {
      const sk = String(item.SK || "");
      const userId = sk ? sk.substring(5) : sk;

      return {
        username: item.username,
        userId,
        accessLevel: item.accessLevel ?? "user",
      };
    });

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json();
  }
});

export default router;
