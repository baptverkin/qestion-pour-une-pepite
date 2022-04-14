import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../src/database";


const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const _id = req.body._id;
  const gameId = req.body.gameId;
  const points = req.body.questionPoints;
  const _idPlayer2 = req.body.gameIdPlayer2
  const _idPlayer3 = req.body.gameIdPlayer3
  const _idPlayer4 = req.body.gameIdPlayer4


  console.log("id", _id);
  console.log("gameId", gameId)
  console.log("points", points);
  console.log("pseudo2", _idPlayer2);
  console.log("pseudo3", _idPlayer3);
  console.log("pseudo4", _idPlayer4);

  const mongodb = await getDatabase();
  const game = await mongodb.db().collection("current-games").findOne({_id : gameId});
  console.log("game", game);

  // if()
  const updateGameScore = mongodb.db().collection("current-games")

  res.redirect(307, `/`).end()

}
export default handler;

