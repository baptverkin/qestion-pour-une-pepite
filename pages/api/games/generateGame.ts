import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import router from "next/router";
import { getDatabase } from "../../../src/database";
import { v4 as uuidv4 } from "uuid";


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
          scoreFaceAFace: 0,
          answeredQuestion : false } ,
      player2:
      { _id : uuidv4(),
        pseudo : "IA Lucas",
        score9PtsGagnant : 0,
        score4ALaSuite: 0,
        scoreFaceAFace: 0,
        answeredQuestion : false,} ,
      player3:
        { _id : uuidv4(),
        pseudo : "IA Bot Martin",
        score9PtsGagnant : 0,
        score4ALaSuite: 0,
        scoreFaceAFace: 0,
        answeredQuestion : false} ,
      player4:
        { _id : uuidv4(),
        pseudo : "IA Glados",
        score9PtsGagnant : 0,
        score4ALaSuite: 0,
        scoreFaceAFace: 0,
        answeredQuestion : false}},
      email: email,
      difficulty: difficulty,
      finished: false,
      neufPointsGagnants : [],
      quatreALaSuite: [],
      faceAFace: [],
    });

    const findId = await mongodb.db().collection("current-games").findOne({email : email, finished : false }).then((result)=> result?._id.toString());
    console.log("finId", findId)

    // .then (()=> router.push(`/games/${findId}`));
  // router.push(`/games/${findId}`);
  res.redirect(307, `/games/complete-game/${findId}`).end()
}

export default handler;
