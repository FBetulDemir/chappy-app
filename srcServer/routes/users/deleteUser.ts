import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { db, tableName } from "../../data/dynamoDb.js";
import express from "express";
import type { Payload, UserIdParam } from "../../data/types.js";
import { validateJwt } from "../../auth/validateJwt.js";
import type { Router, Request, Response } from "express";

const router: Router = express.Router();

router.delete(
  "/:userId",
  async (req: Request<UserIdParam>, res: Response<void>) => {
    const userIdToDelete: string = req.params.userId;
    console.log("Attempting to delete user with ID:", userIdToDelete);
    console.log("Looking for Key:", {
      PK: "USER",
      SK: `USER#${userIdToDelete}`,
    });

    const maybePayload: Payload | null = validateJwt(
      req.headers["authorization"]
    );
    if (!maybePayload) {
      console.log("Validation of JWT failed");
      res.sendStatus(401);
      return;
    }

    const { userId, accessLevel } = maybePayload;

    // the user herself/himself can delete
    if (userId !== userIdToDelete) {
      console.log("Access failed to delete user ", userId, accessLevel);
      res.sendStatus(401);
      return;
    }

    const command = new DeleteCommand({
      TableName: tableName,
      Key: {
        PK: "USER",
        SK: "USER#" + userIdToDelete,
      },
      ReturnValues: "ALL_OLD",
    });

    const output = await db.send(command);

    if (output.Attributes) {
      //success deleting user
      // user existed and was deleted
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);

export default router;
