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
  const answerIa4 = req.body.answerIa4;

  const mongodb = await getDatabase();

  const game = await mongodb
    .db()
    .collection("current-games")
    .findOne({ _id: new ObjectId(gameId) });

  if (game?.players.player4._id === _idPlayer4) {
    const currentScore: number = game?.players.player4.score9PtsGagnant

    const numeroManche = game?.neufPointsGagnants.length;
    const updateGame = await mongodb
      .db()
      .collection("current-games")
      .updateOne(
        { _id : new ObjectId(gameId) },
        {
          $set: {
            [`neufPointsGagnants.${numeroManche-1}.player4`]: {
                clickedResponse: answerIa4,
                correctAnswer: true,
                score: points,
                time: timer,
              },
            },
          },
      );
      const updateScore = await mongodb
      .db()
      .collection("current-games")
      .updateOne(
        { _id : new ObjectId(gameId) },
        {
          $set: {
            ["players.player4.score9PtsGagnant"]: currentScore + points,
            },
          },
      );
  } else {
    console.log("wrong id");
  }

  res.redirect(307, `/games/complete-game/${gameId}`).end();
};
export default handler;
