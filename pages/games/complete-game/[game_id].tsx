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

  // const questionUsed =
  //   questionsList[Math.floor(Math.random() * questionsList.length)];
  // const questionIdBeforeParse = questionUsed._id;
  // const badresponses = questionUsed.responses;
  // const allTheReponses = [...badresponses, questionUsed.goodAnswer];
  //const shuffledResponses = allTheReponses.sort(() => Math.random() - 0.5);

  const currentGame = await mongodb
    .db()
    .collection("current-games")
    .findOne({ email: email, finished: false });

  const players = currentGame?.players;
  const findGameId = currentGame?._id;
  const findGameIdplayer2 = currentGame?.players.player2._id;
  const findGameIdplayer3 = currentGame?.players.player3._id;
  const findGameIdplayer4 = currentGame?.players.player4._id;
  const findDifficulty = currentGame?.difficulty;

  const gameId = JSON.parse(JSON.stringify(findGameId));
  const gameIdPlayer2 = JSON.parse(JSON.stringify(findGameIdplayer2));
  const gameIdPlayer3 = JSON.parse(JSON.stringify(findGameIdplayer3));
  const gameIdPlayer4 = JSON.parse(JSON.stringify(findGameIdplayer4));
  const difficulty = JSON.parse(JSON.stringify(findDifficulty));
  //const questionId = JSON.parse(JSON.stringify(questionIdBeforeParse));

  return {
    props: {
      userDB: userDB,
      gameId: gameId,
      gameIdPlayer2: gameIdPlayer2,
      gameIdPlayer3: gameIdPlayer3,
      gameIdPlayer4: gameIdPlayer4,
      //question: questionUsed.question,
      //points: questionUsed.points,
      //answers: JSON.parse(JSON.stringify(allTheReponses)),
      //goodAnswer: questionUsed.goodAnswer,
      players: players,
      // questionId: questionId,
      questionTest: JSON.parse(JSON.stringify(questionsList)),
      difficulty: difficulty,
    },
  };
};

const Game1: React.FC<{
  userDB: any;
  gameId: ObjectId;
  gameIdPlayer2: ObjectId;
  gameIdPlayer3: ObjectId;
  gameIdPlayer4: ObjectId;
  // question: string;
  // answers: string[];
  // goodAnswer: string;
  players: any;
  // points: number;
  // questionId: ObjectId;
  questionTest: any;
  difficulty: string;
}> = ({
  userDB,
  gameId,
  gameIdPlayer2,
  gameIdPlayer3,
  gameIdPlayer4,
  //question,
  //answers,
  //goodAnswer,
  players,
  //points,
  // questionId,
  questionTest,
  difficulty,
}) => {
  const [timer, setTimer] = useState(30);
  const [isDone, setIsDone] = useState(false);
  const [disableTime, setDisableTime] = useState(false);
  const [disableTrue, setDisableTrue] = useState(false);
  const [disableWrong, setDisableWrong] = useState(false);
  const [iATimer2, setIaTimer2] = useState(10);
  const [isDoneIa2, setIsDoneIa2] = useState(false);
  const [iATimer3, setIaTimer3] = useState(15);
  const [isDoneIa3, setIsDoneIa3] = useState(false);
  const [iATimer4, setIaTimer4] = useState(20);
  const [isDoneIa4, setIsDoneIa4] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [question, setQuestion] = useState(
    Math.floor(Math.random() * questionTest.length)
  );

  // if (difficulty === "facile") {
  //   setIaTimer2(20);
  //   setIaTimer3(25);
  //   setIaTimer4(29);
  // } else if (difficulty === "moyen") {
  //   setIaTimer2(15);
  //   setIaTimer3(20);
  //   setIaTimer4(24);
  // } else {
  //   setIaTimer2(10);
  //   setIaTimer3(15);
  //   setIaTimer4(19);
  // }

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => timerReduce(), 1000);
    } else {
      setIsDone(true);
    }
    if (isDone) {
      setDisableTime(true);
    }
  }, [timer, isDone]);

  const answers: string[] = [
    ...questionTest[question].responses,
    questionTest[question].goodAnswer,
  ];
  const goodAnswer: string = questionTest[question].goodAnswer;
  const points: number = questionTest[question].points;
  const questionId: ObjectId = questionTest[question]._id;

  function endOfManche(): any {
    setQuestion(Math.floor(Math.random() * questionTest.length));
    setTimer(30);
    setIsDone(false);
    setDisableTime;
    setDisableTrue(false);
    setDisableWrong(false);
    setIaTimer2(10);
    setIsDoneIa2(false);
    setIaTimer3(15);
    setIsDoneIa3(false);
    setIaTimer4(20);
    setIsDoneIa4(false);
    setMessage("");
    setResponse("");
  }

  useEffect(() => {
    if (iATimer2 > 0) {
      setTimeout(() => timerReduceIa2(), 1000);
    } else {
      setIsDoneIa2(true);
    }
    if (isDoneIa2) {
      if (disableTrue !== true && disableTime !== true) {
        const answerIa2 = answers[Math.floor(Math.random() * answers.length)];
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
          questionId: questionId,
          answerIa2: answerIa2,
          goodAnswer: goodAnswer,
          timer: timer,
        };

        if (answerIa2 === goodAnswer) {
          showResult(true, temp.pseudo2, temp.goodAnswer);
          fetch("/api/handle-answer-player2/good-answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(temp),
          }).then((result) => router.push(result.url));
          setDisableTrue(true);
          endOfManche();
          endOfManche();
        } else {
          showResult(false, temp.pseudo2, temp.goodAnswer);
          fetch("/api/handle-answer-player2/wrong-answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(temp),
          });
        }
      } else {
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
          questionId: questionId,
          goodAnswer: goodAnswer,
          timer: timer,
        };
        fetch("/api/handle-answer-player2/wrong-answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(temp),
        });
      }

      //créer les 3 IAs et leurs actions dans la DB
      //envoyer la question suivante
      //créer une nouvelle manche DB
      //reset tous les useStates
    }
  }, [iATimer2, isDoneIa2]);

  function timerReduce() {
    setTimer(timer - 1);
  }
  function timerReduceIa2() {
    setIaTimer2(iATimer2 - 1);
  }

  useEffect(() => {
    if (iATimer3 > 0) {
      setTimeout(() => timerReduceIa3(), 1000);
    } else {
      setIsDoneIa3(true);
    }
    if (isDoneIa3) {
      if (disableTrue !== true && disableTime !== true) {
        const answerIa3 = answers[Math.floor(Math.random() * answers.length)];

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
          questionId: questionId,
          answerIa3: answerIa3,
          goodAnswer: goodAnswer,
          timer: timer,
        };

        if (answerIa3 === goodAnswer) {
          showResult(true, temp.pseudo3, temp.goodAnswer);
          fetch("/api/handle-answer-player3/good-answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(temp),
          }).then((result) => router.push(result.url));
          setDisableTrue(true);
          endOfManche();
        } else {
          showResult(false, temp.pseudo3, temp.goodAnswer);
          fetch("/api/handle-answer-player3/wrong-answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(temp),
          });
        }
      } else {
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
          questionId: questionId,
          goodAnswer: goodAnswer,
          timer: timer,
        };

        fetch("/api/handle-answer-player3/wrong-answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(temp),
        });
      }
    }
  }, [iATimer3, isDoneIa3]);

  function timerReduceIa3() {
    setIaTimer3(iATimer3 - 1);
  }

  useEffect(() => {
    if (iATimer4 > 0) {
      setTimeout(() => timerReduceIa4(), 1000);
    } else {
      setIsDoneIa4(true);
    }
    if (isDoneIa4) {
      if (disableTrue !== true && disableTime !== true) {
        const answerIa4 = answers[Math.floor(Math.random() * answers.length)];

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
          questionId: questionId,
          answerIa4: answerIa4,
          goodAnswer: goodAnswer,
          timer: timer,
        };

        if (answerIa4 === goodAnswer) {
          showResult(true, temp.pseudo4, temp.goodAnswer);
          fetch("/api/handle-answer-player4/good-answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(temp),
          }).then((result) => router.push(result.url));
          setDisableTrue(true);
          endOfManche();
        } else {
          showResult(false, temp.pseudo4, temp.goodAnswer);
          fetch("/api/handle-answer-player4/wrong-answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(temp),
          });
        }
      } else {
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
          questionId: questionId,
          goodAnswer: goodAnswer,
          timer: timer,
        };
        fetch("/api/handle-answer-player4/wrong-answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(temp),
        });
      }
    }
  }, [iATimer4, isDoneIa4]);

  function timerReduceIa4() {
    setIaTimer4(iATimer4 - 1);
  }

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
      questionId: questionId,
      clickedResponse: clickedResponse,
      goodAnswer: goodAnswer,
      timer: timer,
    };

    if (clickedResponse === goodAnswer) {
      showResult(true, temp.pseudo1, temp.goodAnswer);
      fetch("/api/handle-answer-player1/good-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(temp),
      }).then((result) => router.push(result.url));
      setDisableTrue(true);
      endOfManche();
    } else {
      showResult(false, temp.pseudo1, temp.goodAnswer);
      setDisableWrong(true);
      fetch("/api/handle-answer-player1/wrong-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(temp),
      });
    }
  }

  function showResult(
    isThatAGoodResponse: boolean,
    pseudo: string,
    goodAnswer: string
  ) {
    if (isThatAGoodResponse) {
      setMessage(`Congrats ${pseudo} ! The good answer was ${goodAnswer}`);
    } else {
      setMessage(`${pseudo} picked a wrong answer !`);
    }
  }

  return (
    <Layout>
      <div className={styles.title} style={{ marginTop: "20px" }}>
        {" "}
        9 points gagnants
      </div>
      <div className={styles.description}>
        {" "}
        {questionTest[question].question}
      </div>
      <div style={{ marginLeft: "20px" }}>{timer}</div>
      <div style={{ marginLeft: "20px" }}>{message}</div>
      <div className="container">
        <div className="row">
          <div className="column">
            {" "}
            <button
              className="button button2"
              disabled={disableTrue || disableWrong || disableTime}
              onClick={() => {
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
              disabled={disableTrue || disableWrong || disableTime}
              onClick={() => {
                setResponse(answers[1]);
                handleResponse(answers[1]);
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
              disabled={disableTrue || disableWrong || disableTime}
              onClick={() => {
                setResponse(answers[2]);
                handleResponse(answers[2]);
              }}
            >
              {answers[2]}
            </button>
          </div>
          <div className="column">
            <button
              className="button button2"
              disabled={disableTrue || disableWrong || disableTime}
              onClick={() => {
                setResponse(answers[3]);
                handleResponse(answers[3]);
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
              disabled={disableTrue || disableWrong || disableTime}
              onClick={() => {
                setResponse(answers[4]);
                handleResponse(answers[4]);
              }}
            >
              {answers[4]}
            </button>
          </div>
          <div className="column">
            <button
              className="button button2"
              disabled={disableTrue || disableWrong || disableTime}
              onClick={() => {
                setResponse(answers[5]);
                handleResponse(answers[5]);
              }}
            >
              {answers[5]}
            </button>
          </div>
        </div>
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
