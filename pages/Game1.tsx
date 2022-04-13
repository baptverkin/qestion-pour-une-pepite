import { useUser } from "@auth0/nextjs-auth0";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
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

  return {
    props: {
      userDB: userDB,
    },
  };
};

const Game1: React.FC<{ userDB: any }> = ({ userDB }) => {
  const [timer, setTimer] = useState(30);
  const [isDone, setIsDone] = useState(false)
  const [disable, setDisable] = useState(false);
  useEffect(() => {
  if (timer > 0 )
  {setTimeout(() => timerReduce(), 1000)}
  else {

  }
  }, [timer])

  function timerReduce (){
    setTimer(timer-1)
  }
  return(
    <Layout>
    <div className={styles.title} style= {{marginTop: "20px"}}> 9 points gagnants</div>
    <div className={styles.description}> Question: quelle est la couleur de la mer noire?</div>
    {timer}
<div className="container">
  <div className="row">
  <div className="column"   > <button disabled={disable} onClick={() => setDisable(true)}>1</button></div>
  <div className="column"><button disabled={disable} onClick={() => setDisable(true)}>2</button></div>

  <div className="row">
  <div className="column"   > <button disabled={disable} onClick={() => setDisable(true)}>3</button></div>
  <div className="column"><button disabled={disable} onClick={() => setDisable(true)}>4</button></div>
</div>

<div className="row">
  <div className="column"   > <button disabled={disable} onClick={() => setDisable(true)}>5</button></div>
  <div className="column"><button disabled={disable} onClick={() => setDisable(true)}>6</button></div>
</div>
</div>
</div>


    </Layout>
  )
}



export default Game1
