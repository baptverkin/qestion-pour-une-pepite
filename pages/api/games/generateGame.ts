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
  const _idPlayer2 = req.body._idPlayer2;
  const pseudoPlayer2 = req.body.pseudoPlayer2;
  const _idPlayer3 = req.body._idPlayer3;
  const pseudoPlayer3 = req.body.pseudoPlayer3;
  const _idPlayer4 =  req.body._idPlayer4;
  const pseudoPlayer4= req.body.pseudoPlayer4;

  let difficulty = req.body.difficulty;
  if (difficulty === "") {
    difficulty = "facile";
  }
  const mongodb = await getDatabase();

    const createGame = await mongodb.db().collection("current-games").insertOne({
      players :
      {player1:
        { _id : _id,
          pseudo : pseudo,
          score9PtsGagnant : 0,
          score4ALaSuite: 0,
          scoreFaceAFace: 0} ,
      player2:
      { _id : _idPlayer2,
        pseudo : pseudoPlayer2,
        score9PtsGagnant : 0,
        score4ALaSuite: 0,
        scoreFaceAFace: 0} ,
      player3:
        { _id : _idPlayer3,
        pseudo : pseudoPlayer3,
        score9PtsGagnant : 0,
        score4ALaSuite: 0,
        scoreFaceAFace: 0} ,
      player4:
        { _id : _idPlayer4,
        pseudo : pseudoPlayer4,
        score9PtsGagnant : 0,
        score4ALaSuite: 0,
        scoreFaceAFace: 0}
      },
      email: email,
      difficulty: difficulty,
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
