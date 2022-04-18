import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../src/database";
import { ObjectId } from "mongodb";
import { type } from "os";

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

  console.log("coucou on est dans l'API")

  const mongodb = await getDatabase();

  const updateGame = await mongodb
  .db()
  .collection("current-games")
  .updateOne({_id : new ObjectId(gameId)}, {$set: {finished : true}})

  const game = await mongodb
    .db()
    .collection("current-games")
    .findOne({ _id: new ObjectId(gameId) });

    const player1 = await mongodb
      .db()
      .collection("users")
      .findOne({_id : new ObjectId(_id)})

    const player2 = await mongodb
      .db()
      .collection("users")
      .findOne({_id : new ObjectId(_idPlayer2)})

    const player3 = await mongodb
      .db()
      .collection("users")
      .findOne({_id : new ObjectId(_idPlayer3)})

    const player4 = await mongodb
      .db()
      .collection("users")
      .findOne({_id : new ObjectId(_idPlayer4)})

    const scorePlayer1 = game?.players.player1.score9PtsGagnant;
    const scorePlayer2 = game?.players.player2.score9PtsGagnant;
    const scorePlayer3 = game?.players.player3.score9PtsGagnant;
    const scorePlayer4 = game?.players.player4.score9PtsGagnant;

    console.log("score :", scorePlayer1)
    console.log("typeof", typeof scorePlayer1)

    const victoriesPlayer1: number = player1?.victories
    const victoriesPlayer2: number = player2?.victories
    const victoriesPlayer3: number = player3?.victories
    const victoriesPlayer4: number = player4?.victories

    console.log("victories player1", victoriesPlayer1)
    console.log("type of victories player1", typeof victoriesPlayer1)
    console.log("test addition", victoriesPlayer1 +1 )

    const playedGamesPlayer1 : number = player1?.playedGames
    const playedGamesPlayer2 : number = player2?.playedGames
    const playedGamesPlayer3 : number = player3?.playedGames
    const playedGamesPlayer4 : number = player4?.playedGames

    console.log("playedGames player1", playedGamesPlayer1)
    console.log("type of playedGames player1", typeof playedGamesPlayer1)
    console.log("test addition", playedGamesPlayer1 +1 )


      console.log("compare ids", _id, gameId);


    const updatePlayedGamesplayer1 = await mongodb
      .db()
      .collection("users")
      .updateOne({_id : new ObjectId(_id)}, {$set: {playedGames : playedGamesPlayer1 + 1 }})

    const updatePlayedGamesplayer2 = await mongodb
      .db()
      .collection("users")
      .updateOne({_id : new ObjectId(_idPlayer2)}, {$set: {playedGames : playedGamesPlayer2 + 1 }})

    const updatePlayedGamesplayer3 = await mongodb
      .db()
      .collection("users")
      .updateOne({_id : new ObjectId( _idPlayer3)}, {$set: {playedGames : playedGamesPlayer3 + 1 }})

    const updatePlayedGamesplayer4 = await mongodb
      .db()
      .collection("users")
      .updateOne({_id : new ObjectId(_idPlayer4)}, {$set: {playedGames : playedGamesPlayer4 +1 }})

  if (scorePlayer1 >= 9 ) {
    console.log("coucou on est dans le score du player 1 >9")
    const updatePlayer1 = await mongodb
      .db()
      .collection("users")
      .updateOne(
        {_id : new ObjectId(_id)},
        {$set: {victories : victoriesPlayer1 + 1},},
      )
      console.log("updateplayer1", updatePlayer1);

  } else if (scorePlayer2 >=9 ) {
    const updatePlayer2 = await mongodb
      .db()
      .collection("users")
      .updateOne(
        {_id : new ObjectId(_idPlayer2)},
        {$set: {victories : victoriesPlayer2 + 1}}
      )
  } else if (scorePlayer3 >=9 ) {
    const updatePlayer3 = await mongodb
      .db()
      .collection("users")
      .updateOne(
        {_id : new ObjectId(_idPlayer3)},
        {$set: {victories : victoriesPlayer3 + 1}}
      )
  } else if (scorePlayer4 >=9 ) {
    const updatePlayer4 = await mongodb
      .db()
      .collection("users")
      .updateOne(
        {_id : new ObjectId(_idPlayer4)},
        {$set: {victories : victoriesPlayer4 + 1}}
      )
  }


  res.end();
};
export default handler;
