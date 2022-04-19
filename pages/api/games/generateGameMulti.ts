import { NextApiRequest, NextApiResponse } from "next";
import router from "next/router";
import { getDatabase } from "../../../src/database";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const _id = req.body._id;
  const email = req.body.email;
  const pseudo = req.body.pseudo;

  const mongodb = await getDatabase();

  const getPlayers = await mongodb
  .db()
  .collection("current-games-multi")
  .find()
  .toArray()

  console.log("getPlayers", getPlayers)

  // const players = getPlayers

    const createGame = await mongodb.db().collection("current-games").insertOne({
      players :
      {player1:
        { _id : getPlayers[0]._id,
          pseudo : getPlayers[0].pseudo,
          score9PtsGagnant : 0,
          score4ALaSuite: 0,
          scoreFaceAFace: 0} ,
      player2:
      { _id : getPlayers[1]._id,
        pseudo : getPlayers[1].pseudo,
        score9PtsGagnant : 0,
        score4ALaSuite: 0,
        scoreFaceAFace: 0} ,
      player3:
        { _id : getPlayers[2]._id,
        pseudo : getPlayers[2].pseudo,
        score9PtsGagnant : 0,
        score4ALaSuite: 0,
        scoreFaceAFace: 0} ,
      player4:
        { _id : getPlayers[3]._id,
        pseudo : getPlayers[3].pseudo,
        score9PtsGagnant : 0,
        score4ALaSuite: 0,
        scoreFaceAFace: 0}
      },
      email: email,
      finished: false,
      neufPointsGagnants : [{manche : 1, questionId : "", player1: {}, player2: {}, player3: {}, player4: {}}],
      quatreALaSuite: [],
      faceAFace: [],
    });

    const gameId = await mongodb.db().collection("current-games").findOne({email : email, finished : false }).then((result)=> result?._id.toString());
    console.log("finId", gameId)

  res.redirect(307, `/games/complete-game/${gameId}`).end()
}

export default handler;
