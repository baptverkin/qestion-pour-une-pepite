import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../src/database";
import { ObjectId } from "mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const _id = req.body._id;
  const gameId = req.body.gameId;
  const points: number = req.body.questionPoints;
  const _idPlayer2 = req.body.gameIdPlayer2;
  const _idPlayer3 = req.body.gameIdPlayer3;
  const _idPlayer4 = req.body.gameIdPlayer4;
  const questionId = req.body.questionId;
  const clickedResponse = req.body.clickedResponse;
  const timer = req.body.timer;
  const answerIa2 = req.body.answerIa2;

  const mongodb = await getDatabase();

  const game = await mongodb
    .db()
    .collection("current-games")
    .findOne({ _id: new ObjectId(gameId) });

  const numeroManche = game?.neufPointsGagnants.length;

  const createManche = await mongodb
    .db()
    .collection("current-games")
    .updateOne(
      { _id: new ObjectId(gameId) },
      {
        $push: {
          [`neufPointsGagnants`]: {
            manche: `${numeroManche + 1}`,
            questionId: "",
            player1: {},
            player2: {},
            player3: {},
            player4: {},
          },
        },
      }
    );
  res.redirect(307, `/games/complete-game/multi/${gameId}`).end();
};

export default handler;
