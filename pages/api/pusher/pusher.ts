import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";
import { getDatabase } from "../../../src/database";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const APP_ID = process.env.APP_ID || "";
  const APP_KEY = process.env.APP_KEY || "";
  const APP_SECRET = process.env.APP_SECRET || "";
  const APP_CLUSTER = process.env.APP_CLUSTER || "";
  const pseudo = req.query.pseudo;
  const _id = req.query.id;
  const gameId = req.query.gameId;

  // console.log("id", _id);
  const pusher = new Pusher({
    appId: APP_ID,
    key: APP_KEY,
    secret: APP_SECRET,
    cluster: APP_CLUSTER,
  });

  const mongodb = await getDatabase();

  const findGame = await mongodb
    .db()
    .collection("current-games")
    .findOne({ _id: new ObjectId(gameId.toString()) });
  console.log("findGale", findGame);

  if (findGame?.players.player2._id === "") {
    const updateGame = await mongodb
      .db()
      .collection("current-games")
      .updateOne(
        { _id: new ObjectId(gameId.toString()) },
        {
          $set: {
            "players.player2": {
              _id: _id,
              pseudo: pseudo,
              score9PtsGagnant: 0,
              score4ALaSuite: 0,
              scoreFaceAFace: 0,
            },
          },
        }
      );
  } else if (findGame?.players.player3._id === "") {
    const updateGame = await mongodb
      .db()
      .collection("current-games")
      .updateOne(
        { _id: new ObjectId(gameId.toString()) },
        {
          $set: {
            "players.player3": {
              _id: _id,
              pseudo: pseudo,
              score9PtsGagnant: 0,
              score4ALaSuite: 0,
              scoreFaceAFace: 0,
            },
          },
        }
      );
  } else if (findGame?.players.player4._id === "") {
    const updateGame = await mongodb
      .db()
      .collection("current-games")
      .updateOne(
        { _id: new ObjectId(gameId.toString()) },
        {
          $set: {
            "players.player4": {
              _id: _id,
              pseudo: pseudo,
              score9PtsGagnant: 0,
              score4ALaSuite: 0,
              scoreFaceAFace: 0,
            },
          },
        }
      );
  }

  pusher.trigger("tests", "test-event", {
    pseudo: pseudo,
    messageType: "Join 9 points gagnants",
  });
  res.end();
};

export default handler;
