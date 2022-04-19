import { NextApiRequest, NextApiResponse } from "next";
import Pusher from "pusher";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const APP_ID = process.env.APP_ID || "";
  const APP_KEY = process.env.APP_KEY || "";
  const APP_SECRET = process.env.APP_SECRET || "";
  const APP_CLUSTER = process.env.APP_CLUSTER || "";
  const pseudo = req.query.pseudo;
  const pusher = new Pusher({
    appId: APP_ID,
    key: APP_KEY,
    secret: APP_SECRET,
    cluster: APP_CLUSTER,
  });

  pusher.trigger("tests", "test-event", {
    pseudo: pseudo,
    messageType: "Join 9 points gagnants",
  });
  res.end();
};

export default handler;
