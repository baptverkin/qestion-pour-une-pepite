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
  const questionNumber = req.query.number;
  console.log("question number", questionNumber)

  // console.log("id", _id);
  const pusher = new Pusher({
    appId: APP_ID,
    key: APP_KEY,
    secret: APP_SECRET,
    cluster: APP_CLUSTER,
  });
  console.log("test call plop");

  pusher.trigger("tests", "partyLaunch", {
    questionNumber : questionNumber,
    pseudo : pseudo,
  });

  res.end();
}

export default handler
