import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../src/database";
import { ObjectId } from "mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const _id = req.body._id;
  const gameId = req.body.gameId;
  const points = req.body.questionPoints;
  const _idPlayer2 = req.body.gameIdPlayer2;
  const _idPlayer3 = req.body.gameIdPlayer3;
  const _idPlayer4 = req.body.gameIdPlayer4;
  const questionId = req.body.questionId;
  const clickedResponse = req.body.clickedResponse;
  const timer = req.body.timer;

  const mongodb = await getDatabase();

  const game = await mongodb
    .db()
    .collection("current-games")
    .findOne({ _id: new ObjectId(gameId) });


  if (game?.players.player1._id === _id) {
    const numeroManche = game?.neufPointsGagnants.length;
    const updateGame = await mongodb
      .db()
      .collection("current-games")
      .updateOne(
        { _id : new ObjectId(gameId) },
        {
          $set: {
            [`neufPointsGagnants.${numeroManche-1}.player1`]: {
                clickedResponse: clickedResponse,
                correctAnswer: false,
                score: 0,
                time: timer,
              },
            },
          },
      );
  } else {
    console.log("wrong id");
  }

  res.end();
};
export default handler;
