import type { GetServerSideProps, NextPage } from "next";
import { Layout } from "../../../components/layout";
import styles from "../../../styles/Home.module.css";
import { getDatabase } from "../../../src/database";
import { getSession } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import router from "next/router";

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

  console.log("poitns:", players);

  return {
    props: {
      userDB: userDB,
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
  question: string;
  answers: string[];
  goodAnswer: string;
  players: any;
  points: number;
}> = ({ userDB, question, answers, goodAnswer, players, points }) => {
  const [timer, setTimer] = useState(30);
  const [isDone, setIsDone] = useState(false);
  const [disable, setDisable] = useState(false);
  const [message, setMessage] = useState("");

  console.log("userDB", userDB._id);

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => timerReduce(), 1000);
    } else {
      setIsDone(true);
      console.log(isDone);
    }
    if (isDone) {
      setDisable(true);
    }
  }, [timer, isDone]);

  function timerReduce() {
    setTimer(timer - 1);
  }

  function compareResponse(
    response: string,
    e: { preventDefault: () => void; target: any }
  ) {
    setDisable(true);

    e.preventDefault();
    console.log("test prevent default", e.preventDefault());

    const temp = {
      _id: userDB._id,
      questionPoints: points,
    };

    if (response === goodAnswer) {
      showResult(true);
      fetch("api/handle-answer/good-answer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(temp),
      }).then((result) => router.push(result.url));

      return false;
    } else {
      showResult(false);
      fetch("api/handle-answer/wrong-answer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(temp),
      }).then((result) => router.push(result.url));
      return true;
    }
  }

  // const handleSubmit = (e: { preventDefault: () => void; target: any }) => {
  //   e.preventDefault();

  //   const temp = {
  //     pseudo: input,
  //     email: email,
  //   };
  //   fetch("/api/update_user", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(temp),
  //   }).then(() => router.push("/profile"));
  // };

  function showResult(isThatAGoodResponse: boolean) {
    if (isThatAGoodResponse) {
      setMessage("This is the good response");
    } else {
      setMessage("This is not the good response");
    }
  }

  console.log("players ===", players);

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
              onClick={() => compareResponse(answers[0])}
            >
              {answers[0]}
            </button>
          </div>
          <div className="column">
            <button
              className="button button2"
              disabled={disable}
              onClick={() => compareResponse(answers[1])}
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
              onClick={() => compareResponse(answers[2])}
            >
              {answers[2]}
            </button>
          </div>
          <div className="column">
            <button
              className="button button2"
              disabled={disable}
              onClick={() => compareResponse(answers[3])}
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
              onClick={() => compareResponse(answers[4])}
            >
              {answers[4]}
            </button>
          </div>
          <div className="column">
            <button
              className="button button2"
              disabled={disable}
              onClick={() => compareResponse(answers[5])}
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
