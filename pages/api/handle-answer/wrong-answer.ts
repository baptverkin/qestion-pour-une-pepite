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

  console.log("id", _id);
  console.log("gameId", gameId);
  console.log("points", points);
  console.log("pseudo2", _idPlayer2);
  console.log("pseudo3", _idPlayer3);
  console.log("pseudo4", _idPlayer4);

  const mongodb = await getDatabase();

  const game = await mongodb
    .db()
    .collection("current-games")
    .findOne({ _id: new ObjectId(gameId) });
  console.log("game", game);

  if (game?.players.player1._id === _id) {
    console.log("correct ID");
    const updateGame = await mongodb
      .db()
      .collection("current-games")
      .updateOne(
        { _id: new ObjectId(gameId) },
        { $set: {"players.player1.answeredQuestion": true } }
      );
      console.log("updatdateGame", updateGame)
  } else {
    console.log("wrong id");
  }

  res.redirect(307, `/`).end();
};
export default handler;
