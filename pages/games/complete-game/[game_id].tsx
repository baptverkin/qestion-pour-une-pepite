import type { GetServerSideProps, NextPage } from "next";
import { Layout } from "../../../components/layout";
import styles from "../../../styles/Home.module.css";
import { getDatabase } from "../../../src/database";
import { getSession } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import router from "next/router";
import { ObjectId } from "mongodb";
import Button from "react-bootstrap/esm/Button";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = getSession(req, res);
  const email = session?.user.email;
  const gameIdTest = query.game_id?.toString();

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
  const questionTest = JSON.parse(JSON.stringify(questionsList));

  const findCurrentGame = await mongodb
    .db()
    .collection("current-games")
    .findOne({ _id: new ObjectId(gameIdTest) });

  const currentGame = JSON.parse(JSON.stringify(findCurrentGame));
  const players = currentGame?.players;
  const findGameId = currentGame?._id;

  const findGameIdplayer2 = currentGame?.players.player2._id;
  const findGameIdplayer3 = currentGame?.players.player3._id;
  const findGameIdplayer4 = currentGame?.players.player4._id;
  const findDifficulty = currentGame?.difficulty;
  const findNumeroManche = currentGame?.neufPointsGagnants.length;

  const gameId = JSON.parse(JSON.stringify(findGameId));
  const gameIdPlayer2 = JSON.parse(JSON.stringify(findGameIdplayer2));
  const gameIdPlayer3 = JSON.parse(JSON.stringify(findGameIdplayer3));
  const gameIdPlayer4 = JSON.parse(JSON.stringify(findGameIdplayer4));
  const difficulty = JSON.parse(JSON.stringify(findDifficulty));
  const numeroManche = JSON.parse(JSON.stringify(findNumeroManche));

  return {
    props: {
      userDB: userDB,
      finish: currentGame?.finished,
      gameId: gameId,
      gameIdPlayer2: gameIdPlayer2,
      gameIdPlayer3: gameIdPlayer3,
      gameIdPlayer4: gameIdPlayer4,
      players: players,
      questionTest: questionTest,
      difficulty: difficulty,
      numeroManche: numeroManche,
    },
  };
};

const Game1: React.FC<{
  userDB: any;
  finished: boolean;
  gameId: ObjectId;
  gameIdPlayer2: ObjectId;
  gameIdPlayer3: ObjectId;
  gameIdPlayer4: ObjectId;
  players: any;
  questionTest: any;
  difficulty: string;
  numeroManche: number;
}> = ({
  userDB,
  finished,
  gameId,
  gameIdPlayer2,
  gameIdPlayer3,
  gameIdPlayer4,
  players,
  questionTest,
  difficulty,
  numeroManche,
}) => {
  const [timer, setTimer] = useState(30);
  const [isDone, setIsDone] = useState(false);
  const [disableTime, setDisableTime] = useState(false);
  const [disableTrue, setDisableTrue] = useState(false);
  const [disableWrong, setDisableWrong] = useState(false);
  const [iATimer2, setIaTimer2] = useState(10);
  const [iATimer3, setIaTimer3] = useState(15);
  const [iATimer4, setIaTimer4] = useState(20);
  const [answers, setAnswers] = useState([""]);
  const [goodAnswer, setGoodAnswer] = useState("");
  const [points, setPoints] = useState(0);
  const [player1Points, setPlayer1Points] = useState(0);
  const [player2Points, setPlayer2Points] = useState(0);
  const [player3Points, setPlayer3Points] = useState(0);
  const [player4Points, setPlayer4Points] = useState(0);
  const [questionId, setQuestionId] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [question, setQuestion] = useState(
    Math.floor(Math.random() * questionTest.length)
  );
  const [shuffleAnswer, setShuffleAnswer] = useState(
    (a: any, b: any): any => 0.5 - Math.random()
  );
  const [winnerPlayer1, setWinnerPlayer1] = useState(false);
  const [winnerPlayer2, setWinnerPlayer2] = useState(false);
  const [winnerPlayer3, setWinnerPlayer3] = useState(false);
  const [winnerPlayer4, setWinnerPlayer4] = useState(false);
  const [messageWinnerPlayer1, setMessageWinnerPlayer1] = useState("");
  const [messageWinnerPlayer2, setMessageWinnerPlayer2] = useState("");
  const [messageWinnerPlayer3, setMessageWinnerPlayer3] = useState("");
  const [messageWinnerPlayer4, setMessageWinnerPlayer4] = useState("");

  const bodyData = {
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

  useEffect(() => {
    if (timer > 0) {
      const timer1 = setTimeout(() => setTimer(timer - 1), 1000);

      const arrAnswers = [
        ...questionTest[question].responses,
        questionTest[question].goodAnswer,
      ].sort(() => shuffleAnswer);

      console.log("arr answer", arrAnswers);
      setAnswers(arrAnswers);
      setGoodAnswer(questionTest[question].goodAnswer);
      setPoints(questionTest[question].points);
      setQuestionId(questionTest[question]._id);

      if (difficulty === "facile") {
        setIaTimer2(8);
        setIaTimer3(5);
        setIaTimer4(2);
      } else if (difficulty === "moyen") {
        setIaTimer2(15);
        setIaTimer3(12);
        setIaTimer4(10);
      } else {
        setIaTimer2(25);
        setIaTimer3(22);
        setIaTimer4(20);
      }

      if (timer === iATimer2) {
        if (disableTrue !== true && disableTime !== true) {
          const answerIa2 = answers[Math.floor(Math.random() * answers.length)];
          const bodyDataIa2 = { ...bodyData, answerIa2: answerIa2 };
          console.log("bodyDtaaIa2", bodyDataIa2);

          if (answerIa2 === goodAnswer) {
            showResult(
              true,
              bodyData.pseudo2,
              bodyData.goodAnswer,
              bodyData.questionPoints
            );
            fetch("/api/handle-answer-player2/good-answer", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(bodyDataIa2),
            });
            setDisableTrue(true);
            setPlayer2Points(players.player2.score9PtsGagnant + points);
          } else {
            showResult(
              false,
              bodyData.pseudo2,
              bodyData.goodAnswer,
              bodyData.questionPoints
            );
            fetch("/api/handle-answer-player2/wrong-answer", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(bodyDataIa2),
            });
          }
        } else {
          fetch("/api/handle-answer-player2/wrong-answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          });
        }
      }

      if (timer === iATimer3) {
        if (disableTrue !== true && disableTime !== true) {
          const answerIa3 = answers[Math.floor(Math.random() * answers.length)];
          const bodyDataIa3 = { ...bodyData, answerIa3: answerIa3 };

          if (answerIa3 === goodAnswer) {
            showResult(
              true,
              bodyData.pseudo3,
              bodyData.goodAnswer,
              bodyData.questionPoints
            );
            fetch("/api/handle-answer-player3/good-answer", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(bodyDataIa3),
            });
            setDisableTrue(true);
            setPlayer3Points(players.player3.score9PtsGagnant + points);
          } else {
            showResult(
              false,
              bodyData.pseudo3,
              bodyData.goodAnswer,
              bodyData.questionPoints
            );
            fetch("/api/handle-answer-player3/wrong-answer", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(bodyDataIa3),
            });
          }
        } else {
          fetch("/api/handle-answer-player3/wrong-answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          });
        }
      }

      if (timer === iATimer4) {
        if (disableTrue !== true && disableTime !== true) {
          const answerIa4 = answers[Math.floor(Math.random() * answers.length)];
          const bodyDataIa4 = { ...bodyData, answerIa4: answerIa4 };

          if (answerIa4 === goodAnswer) {
            showResult(
              true,
              bodyData.pseudo4,
              bodyData.goodAnswer,
              bodyData.questionPoints
            );
            fetch("/api/handle-answer-player4/good-answer", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(bodyDataIa4),
            });
            setDisableTrue(true);
            setPlayer4Points(players.player4.score9PtsGagnant + points);
          } else {
            showResult(
              false,
              bodyData.pseudo4,
              bodyData.goodAnswer,
              bodyData.questionPoints
            );
            fetch("/api/handle-answer-player4/wrong-answer", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(bodyDataIa4),
            });
          }
        } else {
          fetch("/api/handle-answer-player4/wrong-answer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          });
        }
      }

      return () => clearTimeout(timer1);
    } else if (timer <= 0 || disableTrue === true) {
      setIsDone(true);
      setDisableTime(true);
    }
  }, [timer, isDone]);

  function handleResponse(clickedResponse: string) {
    const bodyDataPlayer1 = { ...bodyData, clickedResponse: clickedResponse };
    if (clickedResponse === goodAnswer) {
      showResult(
        true,
        bodyData.pseudo1,
        bodyData.goodAnswer,
        bodyData.questionPoints
      );
      fetch("/api/handle-answer-player1/good-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyDataPlayer1),
      });
      setDisableTrue(true);
      setPlayer1Points(players.player1.score9PtsGagnant + points);
    } else {
      showResult(
        false,
        bodyData.pseudo1,
        bodyData.goodAnswer,
        bodyData.questionPoints
      );
      setDisableWrong(true);
      fetch("/api/handle-answer-player1/wrong-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyDataPlayer1),
      });
    }
  }

  function showResult(
    isThatAGoodResponse: boolean,
    pseudo: string,
    goodAnswer: string,
    points: number
  ) {
    if (isThatAGoodResponse) {
      setMessage(
        `Congrats ${pseudo} ! The good answer was ${goodAnswer}. You won ${points} points`
      );
    } else {
      setMessage(`${pseudo} picked a wrong answer !`);
    }
  }

  function endOfManche(): any {
    setQuestion(Math.floor(Math.random() * questionTest.length));
    setTimer(30);
    setIsDone(false);
    setDisableTime(false);
    setDisableTrue(false);
    setDisableWrong(false);
    setIaTimer2(10);
    setIaTimer3(15);
    setMessage("");
    setResponse("");
    setShuffleAnswer((a: any, b: any): any => 0.5 - Math.random());

    if (player1Points >= 9) {
      setWinnerPlayer1(true);
      setMessageWinnerPlayer1(
        `Congrats ${players.player1.pseudo}, you won the game `
      );
      fetch("/api/handle-end-of-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
    } else if (player2Points >= 9) {
      setWinnerPlayer2(true);
      console.log(winnerPlayer2);
      setMessageWinnerPlayer2(
        `Congrats ${players.player2.pseudo}, you won the game `
      );
      fetch("/api/handle-end-of-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
    } else if (player3Points >= 9) {
      setWinnerPlayer3(true);
      setMessageWinnerPlayer3(
        `Congrats ${players.player3.pseudo}, you won the game `
      );
      fetch("/api/handle-end-of-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
    } else if (player4Points >= 9) {
      setWinnerPlayer4(true);
      setMessageWinnerPlayer4(
        `Congrats ${players.player4.pseudo}, you won the game `
      );
      fetch("/api/handle-end-of-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
    }

    fetch("/api/games/generateManche", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    }).then((result) => router.push(result.url));
  }

  if (finished) {
    return (
      <Layout>
        <p>Test</p>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <div className={styles.title} style={{ marginTop: "30px" }}>
          {" "}
          9 points gagnants
        </div>
        {winnerPlayer1 ? (
          <div>
            {messageWinnerPlayer1}
            <br></br>
            {players.player1.pseudo}: {player1Points}
            &nbsp;&nbsp;&nbsp;
            {players.player2.pseudo}: {player2Points}
            &nbsp;&nbsp;&nbsp;
            {players.player3.pseudo}: {player3Points}
            &nbsp;&nbsp;&nbsp;
            {players.player4.pseudo}: {player4Points}
            <br></br>
            <Button className="btn btn-primary" href="/profile">
              Back to my Profile &rarr;
            </Button>
          </div>
        ) : winnerPlayer2 ? (
          <div>
            {messageWinnerPlayer2}
            <br></br>
            {players.player1.pseudo}: {player1Points}
            &nbsp;&nbsp;&nbsp;
            {players.player2.pseudo}: {player2Points}
            &nbsp;&nbsp;&nbsp;
            {players.player3.pseudo}: {player3Points}
            &nbsp;&nbsp;&nbsp;
            {players.player4.pseudo}: {player4Points}
          </div>
        ) : winnerPlayer3 ? (
          <div>
            {messageWinnerPlayer3}
            <br></br>
            {players.player1.pseudo}: {player1Points}
            &nbsp;&nbsp;&nbsp;
            {players.player2.pseudo}: {player2Points}
            &nbsp;&nbsp;&nbsp;
            {players.player3.pseudo}: {player3Points}
            &nbsp;&nbsp;&nbsp;
            {players.player4.pseudo}: {player4Points}
          </div>
        ) : winnerPlayer4 ? (
          <div>
            {messageWinnerPlayer4}
            <br></br>
            {players.player1.pseudo}: {player1Points}
            &nbsp;&nbsp;&nbsp;
            {players.player2.pseudo}: {player2Points}
            &nbsp;&nbsp;&nbsp;
            {players.player3.pseudo}: {player3Points}
            &nbsp;&nbsp;&nbsp;
            {players.player4.pseudo}: {player4Points}
          </div>
        ) : (
          <>
            <div className={styles.description}>
              {" "}
              {questionTest[question].question}
            </div>
            {disableTrue ? (
              <></>
            ) : (
              <div style={{ marginLeft: "20px" }}>{timer}</div>
            )}
            <div style={{ marginLeft: "20px" }}>{message}</div> <br></br>
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
              <br></br>
              <div>
                {players.player1.pseudo}: {player1Points}
                &nbsp;&nbsp;&nbsp;
                {players.player2.pseudo}: {player2Points}
                &nbsp;&nbsp;&nbsp;
                {players.player3.pseudo}: {player3Points}
                &nbsp;&nbsp;&nbsp;
                {players.player4.pseudo}: {player4Points}
              </div>{" "}
              <br></br>
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={endOfManche}
                >
                  Next question &rarr;
                </button>
              </div>
              <br></br>
            </div>
          </>
        )}
      </Layout>
    );
  }
};

export default Game1;
