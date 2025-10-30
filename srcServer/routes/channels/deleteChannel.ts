import express from "express";
import type { Request, Router, Response } from "express";
import { db, tableName } from "../../data/dynamoDb.js";
import { DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import type {
  ChannelBody,
  ChannelIdParam,
  ChannelItem,
  Payload,
} from "../../data/types.js";
import { validateJwt } from "../../auth/validateJwt.js";

const router: Router = express.Router();

router.delete(
  "/:channelId",
  async (req: Request<ChannelIdParam>, res: Response) => {
    const { channelId } = req.params;
    // const requesterId: string = req.body.ownerId;

    const maybePayload: Payload | null = validateJwt(
      req.headers["authorization"]
    );
    if (!maybePayload) {
      console.log("Validation of JWT failed");
      res.sendStatus(401);
      return;
    }

    const { userId } = maybePayload;

    // Only the user who created the channel can delete it
    // if (userId !== requesterId) {
    //   console.log("Access failed to delete channel ", userId);
    //   res.sendStatus(401);
    //   return;
    // }

    const getChannel = new GetCommand({
      TableName: tableName,
      Key: {
        PK: `CHANNEL#${channelId}`,
        SK: "META",
      },
    });

    const result = await db.send(getChannel);
    const channel = result.Item as { ownerId: string; name: string };

    if (!result.Item) {
      return res.status(404).json({ error: "Channel not found" });
    }

    try {
      await db.send(
        new DeleteCommand({
          TableName: tableName,
          Key: {
            PK: `CHANNEL#${channelId}`,
            SK: "META",
          },
          ReturnValues: "ALL_OLD",
        })
      );
      console.log(`Channel '${channel.name}' deleted by ${userId}`);
      return res.sendStatus(204);
    } catch (error) {
      return res.json({ error: "channel not found" });
    }
  }
);

export default router;
