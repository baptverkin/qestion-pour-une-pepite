import type { GetServerSideProps, NextPage } from "next";
import { Layout } from "../../../components/layout";
import styles from "../../../styles/Home.module.css";
import { getDatabase } from "../../../src/database";
import { getSession } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import router from "next/router";
import { ObjectId } from "mongodb";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res);
  const email = session?.user.email;
  const mongodb = await getDatabase();

  const response = await mongodb
    .db()
    .collection("users")
    .findOne({ email: email });
  const userDB = JSON.parse(JSON.stringify(response));

  const questionsList = await mongodb
    .db()
    .collection("9-points-gagnants")
    .find()
    .toArray();

  const questionUsed =
    questionsList[Math.floor(Math.random() * questionsList.length)];
  const badresponses = questionUsed.responses;
  const allTheReponses = [...badresponses, questionUsed.goodAnswer];
  const shuffledResponses = allTheReponses.sort(() => Math.random() - 0.5);

  const currentGame = await mongodb
    .db()
    .collection("current-games")
    .find()
    .toArray();

  const players = currentGame[0].players;
  const findGameId = currentGame[0]._id;
  const findGameIdplayer2 = currentGame[0].players.player2._id;
  const findGameIdplayer3 = currentGame[0].players.player3._id;
  const findGameIdplayer4 = currentGame[0].players.player4._id;

  const gameId = JSON.parse(JSON.stringify(findGameId));
  const gameIdPlayer2 = JSON.parse(JSON.stringify(findGameIdplayer2));
  const gameIdPlayer3 = JSON.parse(JSON.stringify(findGameIdplayer3));
  const gameIdPlayer4 = JSON.parse(JSON.stringify(findGameIdplayer4));

  // const _idGame = currentGame._id;

  return {
    props: {
      userDB: userDB,
      gameId: gameId,
      gameIdPlayer2: gameIdPlayer2,
      gameIdPlayer3: gameIdPlayer3,
      gameIdPlayer4: gameIdPlayer4,
      question: questionUsed.question,
      points: questionUsed.points,
      answers: shuffledResponses,
      goodAnswer: questionUsed.goodAnswer,
      players: players,
    },
  };
};

const Game1: React.FC<{
  userDB: any;
  gameId: ObjectId;
  gameIdPlayer2: ObjectId;
  gameIdPlayer3: ObjectId;
  gameIdPlayer4: ObjectId;
  question: string;
  answers: string[];
  goodAnswer: string;
  players: any;
  points: number;
}> = ({
  userDB,
  gameId,
  gameIdPlayer2,
  gameIdPlayer3,
  gameIdPlayer4,
  question,
  answers,
  goodAnswer,
  players,
  points,
}) => {
  const [timer, setTimer] = useState(30);
  const [isDone, setIsDone] = useState(false);
  const [disable, setDisable] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => timerReduce(), 1000);
    } else {
      setIsDone(true);
    }
    if (isDone) {
      setDisable(true);
    }
  }, [timer, isDone]);

  function timerReduce() {
    setTimer(timer - 1);
  }

  // e: { preventDefault: () => void; target: any }

  function handleResponse(clickedResponse: string) {
    const temp = {
      gameId: gameId,
      _id: userDB._id,
      gameIdPlayer2: gameIdPlayer2,
      gameIdPlayer3: gameIdPlayer3,
      gameIdPlayer4: gameIdPlayer4,
      questionPoints: points,
      pseudo1: players.player1.pseudo,
      pseudo2: players.player2.pseudo,
      pseudo3: players.player3.pseudo,
      pseudo4: players.player4.pseudo,
    };
    console.log("test avant if", response);

    if (clickedResponse === goodAnswer) {
      showResult(true);
      fetch("/api/handle-answer/good-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(temp),
      }).then((result) => router.push(result.url));
      console.log("BodyTrue", JSON.stringify(temp));
    } else {
      showResult(false);
      console.log("test avant call api", response);

      fetch("/api/handle-answer/wrong-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(temp),
      }).then((result) => router.push(result.url));
      console.log("BodyWrong", JSON.stringify(temp));
    }
  }

  function showResult(isThatAGoodResponse: boolean) {
    if (isThatAGoodResponse) {
      setMessage("This is the good response");
    } else {
      setMessage("This is not the good response");
    }
  }

  return (
    <Layout>
      <div className={styles.title} style={{ marginTop: "20px" }}>
        {" "}
        9 points gagnants
      </div>
      <div className={styles.description}> {question}</div>
      {timer}
      <div className="container">
        <div className="row">
          <div className="column">
            {" "}
            <button
              className="button button2"
              disabled={disable}
              onClick={() => {
                setDisable(true);
                setResponse(answers[0]);
                handleResponse(answers[0]);
              }}
            >
              {answers[0]}
            </button>
          </div>
          <div className="column">
            <button
              className="button button2"
              disabled={disable}
              onClick={() => {
                setDisable(true);
                setResponse(answers[1]);
                handleResponse;
              }}
            >
              {answers[1]}
            </button>
          </div>
        </div>

        <div className="row">
          <div className="column">
            {" "}
            <button
              className="button button2"
              disabled={disable}
              onClick={() => {
                setDisable(true);
                setResponse(answers[2]);
                handleResponse;
              }}
            >
              {answers[2]}
            </button>
          </div>
          <div className="column">
            <button
              className="button button2"
              disabled={disable}
              onClick={() => {
                setDisable(true);
                setResponse(answers[3]);
                handleResponse;
              }}
            >
              {answers[3]}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="column">
            {" "}
            <button
              className="button button2"
              disabled={disable}
              onClick={() => {
                setDisable(true);
                setResponse(answers[4]);
                handleResponse;
              }}
            >
              {answers[4]}
            </button>
          </div>
          <div className="column">
            <button
              className="button button2"
              disabled={disable}
              onClick={() => {
                setDisable(true);
                setResponse(answers[5]);
                handleResponse;
              }}
            >
              {answers[5]}
            </button>
          </div>
        </div>
        {message}
        <div>
          {players.player1.pseudo}: {players.player1.score9PtsGagnant}
          &nbsp;&nbsp;&nbsp;
          {players.player2.pseudo}: {players.player2.score9PtsGagnant}
          &nbsp;&nbsp;&nbsp;
          {players.player3.pseudo}: {players.player3.score9PtsGagnant}
          &nbsp;&nbsp;&nbsp;
          {players.player4.pseudo}: {players.player4.score9PtsGagnant}
        </div>
      </div>
    </Layout>
  );
};

export default Game1;
