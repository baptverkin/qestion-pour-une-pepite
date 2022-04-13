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
      { _id : "",
        pseudo : "IA Lucas",
        score9PtsGagnant : 0,
        score4ALaSuite: 0,
        scoreFaceAFace: 0} ,
      player3:
        { _id : "",
        pseudo : "IA Bot Martin",
        score9PtsGagnant : 0,
        score4ALaSuite: 0,
        scoreFaceAFace: 0} ,
      player4:
        { _id : "",
        pseudo : "IA Glados",
        score9PtsGagnant : 0,
        score4ALaSuite: 0,
        scoreFaceAFace: 0}},
      email: email,
      difficulty: difficulty,
      finished: false,
    });

    const findId = await mongodb.db().collection("current-games").findOne({email : email, finished : false }).then((result)=> result?._id.toString());
    console.log("finId", findId)

    // .then (()=> router.push(`/games/${findId}`));
  // router.push(`/games/${findId}`);
  res.redirect(307, `/games/complete-game/${findId}`).end()
}

export default handler;
