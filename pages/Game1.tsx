import type { GetServerSideProps, NextPage } from "next";
import { Layout } from "../components/layout";
import styles from "../styles/Home.module.css";
import { getDatabase } from "../src/database";
import { getSession } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

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

  return {
    props: {
      userDB: userDB,
      question: questionUsed.question,
      answers: shuffledResponses,
      goodAnswer: questionUsed.goodAnswer,
    },
  };
};

const Game1: React.FC<{
  userDB: any;
  question: string;
  answers: string[];
  goodAnswer: string;
}> = ({ userDB, question, answers, goodAnswer }) => {
  const [timer, setTimer] = useState(30);
  const [isDone, setIsDone] = useState(false);
  const [disable, setDisable] = useState(false);
  const [message, setMessage] = useState("")
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

  function compareResponse(response: string) {
    if (response === goodAnswer) {
      setDisable(true);
      showResult(true)
      return false;
    } else {
      setDisable(true);
      showResult(false)
      return true;
    }
  }

  function showResult(isThatAGoodResponse: boolean){
    if (isThatAGoodResponse){
      setMessage("This is the good response")
    } else {
      setMessage("This is not the good response")
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
            <button className="button button2" disabled={disable} onClick={() => compareResponse(answers[0])}>
              {answers[0]}
            </button>
          </div>
          <div className="column">
            <button className="button button2" disabled={disable} onClick={() => compareResponse(answers[1])}>
              {answers[1]}
            </button>
          </div>
          </div>

          <div className="row">
            <div className="column">
              {" "}
              <button className="button button2" disabled={disable} onClick={() => compareResponse(answers[2])}>
                {answers[2]}
              </button>
            </div>
            <div className="column">
              <button className="button button2" disabled={disable} onClick={() => compareResponse(answers[3])}>
                {answers[3]}
              </button>
            </div>
          </div>
          <div className="row">
            <div className="column">
              {" "}
              <button className="button button2" disabled={disable} onClick={() => compareResponse(answers[4])}>
                {answers[4]}
              </button>
            </div>
            <div className="column">
              <button className="button button2" disabled={disable} onClick={() => compareResponse(answers[5])}>
                {answers[5]}
              </button>
            </div>
          </div>
          {message}
        </div>

    </Layout>
  );
};

export default Game1;
