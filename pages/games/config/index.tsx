import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import Link from "next/link";
import router from "next/router";
import Pusher, { Channel } from "pusher-js";
import React, { useEffect } from "react";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { Layout } from "../../../components/layout";
import { getDatabase } from "../../../src/database";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res);
  const email = session?.user.email;
  const emailPlayer2 = "iabotmartin@fewlines.com";
  const emailPlayer3 = "iajehane@fewlines.com";
  const emailPlayer4 = "iafenn@fewlines.com";

  const mongodb = await getDatabase();

  const player1 = await mongodb
    .db()
    .collection("users")
    .findOne({ email: email });
  const usersDb = JSON.parse(JSON.stringify(player1));

  const userPlayer2 = await mongodb
    .db()
    .collection("users")
    .findOne({ email: emailPlayer2 });
  const player2 = JSON.parse(JSON.stringify(userPlayer2));

  const userPlayer3 = await mongodb
    .db()
    .collection("users")
    .findOne({ email: emailPlayer3 });
  const player3 = JSON.parse(JSON.stringify(userPlayer3));

  const userPlayer4 = await mongodb
    .db()
    .collection("users")
    .findOne({ email: emailPlayer4 });
  const player4 = JSON.parse(JSON.stringify(userPlayer4));

  return {
    props: {
      _id: usersDb._id,
      email: usersDb.email,
      pseudo: usersDb.pseudo,
      _idPlayer2: player2._id,
      pseudoPlayer2: player2.pseudo,
      _idPlayer3: player3._id,
      pseudoPlayer3: player3.pseudo,
      _idPlayer4: player4._id,
      pseudoPlayer4: player4.pseudo,
    },
  };
};

const GameConfig: React.FC<{
  _id: ObjectId;
  pseudo: string;
  email: string;
  _idPlayer2: ObjectId;
  pseudoPlayer2: string;
  _idPlayer3: ObjectId;
  pseudoPlayer3: string;
  _idPlayer4: ObjectId;
  pseudoPlayer4: string;
}> = ({
  _id,
  pseudo,
  email,
  _idPlayer2,
  _idPlayer3,
  _idPlayer4,
  pseudoPlayer2,
  pseudoPlayer3,
  pseudoPlayer4,
}) => {
  const [difficulty, setDifficulty] = React.useState("facile");

  const handleButtons = (e: any) => {
    setDifficulty(e.target.value);
  };

  const handleSubmit = async (e: {
    preventDefault: () => void;
    target: any;
  }) => {
    e.preventDefault();
    const temp = {
      _id: _id,
      pseudo: pseudo,
      email: email,
      difficulty: difficulty,
      _idPlayer2: _idPlayer2,
      pseudoPlayer2: pseudoPlayer2,
      _idPlayer3: _idPlayer3,
      pseudoPlayer3: pseudoPlayer3,
      _idPlayer4: _idPlayer4,
      pseudoPlayer4: pseudoPlayer4,
    };

    await fetch("/api/games/generateGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(temp),
    }).then((result) => router.push(result.url));
  };

  return (
    <Layout>
      <div className="container" style={{marginBottom:"2em", marginTop:"2em"}}>
        <h3>Configurer la partie :</h3>
        <label>Joueur 1 : </label> {pseudo}
        <br />
        <label>Joueur 2 : </label> {pseudoPlayer2}
        <br />
        <label>Joueur 3 : </label> {pseudoPlayer3}
        <br />
        <label>Joueur 4 : </label> {pseudoPlayer4}
        <h4>Choix de la difficulté : {difficulty} </h4>
        <ButtonGroup aria-label="Basic example">
          <Button variant="secondary" value="facile" onClick={handleButtons}>
            Facile
          </Button>
          <br />
          <Button variant="secondary" value="moyen" onClick={handleButtons}>
            Moyen
          </Button>
          <br />
          <Button variant="secondary" value="difficile" onClick={handleButtons}>
            Difficile
          </Button>
        </ButtonGroup>
        <br />
        <br />
        <br />
        <br />
        <Button onClick={handleSubmit} variant = "warning"
              style={{
                color:"white"
              }}>Lancer la partie &rarr;</Button>
      </div>
    </Layout>
  );
};

export default GameConfig;
