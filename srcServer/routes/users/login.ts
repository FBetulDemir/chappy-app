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
    // validate body
    const bodyParse = loginSchema.safeParse(req.body);
    if (!bodyParse.success) {
      return res.status(400).json({ error: "Invalid channel data" });
    }
    const body: UserBody = req.body;

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
      res.sendStatus(404);
      return;
    }

    const users: UserItem[] = output.Items as UserItem[];
    const found: UserItem | undefined = users.find(
      (user) => user.username === body.username
    );
    if (!found) {
      res.sendStatus(401);
      return;
    }
    // checks if the passwords are matching
    const passwordMatch: boolean = await compare(body.password, found.password);

    if (!passwordMatch) {
      res.sendStatus(401);
      return;
    }

    // sk = 'USER#id'
    const token: string = createToken(found.SK.substring(5), found.username);
    res.send({ success: true, token: token });
  }
);

export default router;
