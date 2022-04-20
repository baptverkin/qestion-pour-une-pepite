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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = getSession(req, res);
  const email = session?.user.email;
  const gameId = query.game_id;

  const mongodb = await getDatabase();

  const APP_KEY = process.env.APP_KEY;
  const APP_CLUSTER = process.env.APP_CLUSTER;

  const findCurrentGame = await mongodb
    .db()
    .collection("current-games")
    .findOne({ _id: new ObjectId(gameId?.toString()) });
  const currentGame = JSON.parse(JSON.stringify(findCurrentGame));

  const findUser = await mongodb
    .db()
    .collection("users")
    .findOne({ email: email });
  const userDb = JSON.parse(JSON.stringify(findUser));

  return {
    props: {
      userDb: userDb,
      pseudo: userDb.pseudo,
      _id: userDb._id,
      _idPlayer1: currentGame.players.player1._id,
      pseudoPlayer1: currentGame.players.player1.pseudo,
      email: email,
      gameId: gameId,
      appKey: APP_KEY,
      cluster: APP_CLUSTER,
    },
  };
};

const DisplayNames: React.FC<{
  channel?: Channel;
  pseudoPlayer1: string;
  gameId: ObjectId;
  userDb: any;
  pseudo: string;
}> = ({ channel, pseudoPlayer1, userDb, gameId, pseudo }) => {
  const [names, setNames] = React.useState([pseudoPlayer1]);

  console.log("names ligne 54", names);

  useEffect(() => {
    if (channel) {
      channel.bind("test-event", (data: { pseudo: never }) => {
        setNames((currentNames) => {
          if (currentNames.includes(data.pseudo) === false) {
            return [...currentNames, data.pseudo];
          }
          return currentNames;
        });
        console.log("names ligne 64", names);
      });
      return () => {
        channel.unbind("test-event");
      };
    }
  }, [channel, names]);

  return (
    <div>
      {names.map((name, index) => {
        return (
          <div key={Math.random()}>
            Joueur {index + 1} : {name}
          </div>
        );
      })}
      <br></br>
      <div>
        {names.length === 4
          ? ""
          : `En attente de ${4 - names.length} joueurs...`}
      </div>
    </div>
  );
};

const GameConfig: React.FC<{
  _id: ObjectId;
  pseudo: string;
  email: string;
  appKey: string;
  cluster: string;
  gameId: ObjectId;
  pseudoPlayer1: string;
  userDb: any;
}> = ({
  _id,
  pseudo,
  email,
  appKey,
  cluster,
  gameId,
  pseudoPlayer1,
  userDb,
}) => {
  const [channel, setChannel] = React.useState<Channel>();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const pusher = new Pusher(`${appKey}`, {
      cluster: `${cluster}`,
    });

    const channel = pusher.subscribe("tests");
    setChannel(channel);
  }, [cluster, appKey]);

  const handler = () => {
    setLoading(true);
    fetch(
      `/api/pusher/pusher?pseudo=${pseudo}&id=${_id}&gameId=${gameId}`
    ).then(() => setLoading(false));
  };

  // const handleSubmit = async (e: {
  //   preventDefault: () => void;
  //   target: any;
  // }) => {
  //   e.preventDefault();
  //   const temp = {
  //     _id: _id,
  //     pseudo: pseudo,
  //     email: email,
  //   };

  // await fetch("/api/games/generateGameMulti", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(temp),
  // }).then((result) => router.push(result.url));
  // };

  return (
    <Layout>
      <div className="container">
        <h3>Configurer la partie :</h3>
        <br />
        <DisplayNames
          channel={channel}
          pseudo={pseudo}
          gameId={gameId}
          pseudoPlayer1={pseudoPlayer1}
          userDb={userDb}
        />
        <br />
        <Button onClick={handler} disabled={loading}>
          Join party
        </Button>
        <br />
        <br />
        <br />
        <br />
        <br />
        <Link href={`/games/complete-game/multi/${gameId}`} passHref>
          <Button>Lancer la partie &rarr;</Button>
        </Link>
      </div>
    </Layout>
  );
};

export default GameConfig;
