import express from "express";
import type { Router, Request, Response } from "express";
import { createToken } from "../../auth/auth.js";
import type { JwtResponse, UserBody, UserItem } from "../../data/types.js";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, tableName } from "../../data/dynamoDb.js";
import { compare } from "bcrypt";
import { loginSchema } from "../../validation/validation.js";

const router: Router = express.Router();

router.post(
  "/",
  async (
    req: Request<{}, JwtResponse | { error: string } | void, UserBody>,
    res: Response<JwtResponse | { error: string } | void>
  ) => {
    const bodyParse = loginSchema.safeParse(req.body);
    if (!bodyParse.success) {
      return res.status(400).json({ error: "Invalid channel data" });
    }
    const body: UserBody = req.body;
    console.log("body", body);

    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "#pk = :value",
      ExpressionAttributeValues: {
        ":value": "USER",
      },
      ExpressionAttributeNames: {
        "#pk": "PK",
      },
    });
    const output = await db.send(command);
    if (!output.Items) {
      console.log("No items from db");
      res.sendStatus(404);
      return;
    }

    // validate items with zod
    const users: UserItem[] = output.Items as UserItem[];
    const found: UserItem | undefined = users.find(
      (user) => user.username === body.username
    );
    if (!found) {
      console.log("No matching user");
      res.sendStatus(401);
      return;
    }
    // checks if the passwords are matching
    const passwordMatch: boolean = await compare(body.password, found.password);

    if (!passwordMatch) {
      console.log("Wrong password", body.password, found.password);
      res.sendStatus(401);
      return;
    }

    // sk = 'USER#id'
    console.log("Found user", found);
    const token: string = createToken(found.SK.substring(5));
    res.send({ success: true, token: token });
  }
);

export default router;
