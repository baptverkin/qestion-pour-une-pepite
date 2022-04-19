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
  console.log("id", _id);
  const pusher = new Pusher({
    appId: APP_ID,
    key: APP_KEY,
    secret: APP_SECRET,
    cluster: APP_CLUSTER,
  });

  const mongodb = await getDatabase();

  const findPlayer = await mongodb
    .db()
    .collection("users")
    .findOne({ _id: new ObjectId(_id.toString()) });

  const newGame = await mongodb
    .db()
    .collection("current-games-multi")
    .insertOne({ player: findPlayer });

  pusher.trigger("tests", "test-event", {
    pseudo: pseudo,
    messageType: "Join 9 points gagnants",
  });
  res.end();
};

export default handler;
