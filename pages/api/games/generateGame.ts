import { NextApiRequest, NextApiResponse } from "next";
import router from "next/router";
import { getDatabase } from "../../../src/database";


const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const email = req.body.email;
  const pseudo = req.body.pseudo;
  let difficulty = req.body.difficulty;
  if (difficulty === "") {
    difficulty = "facile";
  }
  const mongodb = await getDatabase();

    const createGame = await mongodb.db().collection("current-games").insertOne({
      players :
      {player1: pseudo,
      player2: "",
      player3: "",
      player4: ""},
      email: email,
      difficulty: difficulty,
      finished: false,
    });

    const findId = await mongodb.db().collection("current-games").findOne({email : email, finished : false }).then((result)=> result?._id.toString());
    console.log("finId", findId)

    // .then (()=> router.push(`/games/${findId}`));
  // router.push(`/games/${findId}`);
  res.redirect(307, `/games/${findId}`).end()
}

export default handler;
