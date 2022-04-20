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
  const APP_KEY = process.env.APP_KEY;
  const APP_CLUSTER = process.env.APP_CLUSTER;

  const mongodb = await getDatabase();
  const player1 = await mongodb
    .db()
    .collection("current-games")
    .findOne({ email: email });
  const currentGame = JSON.parse(JSON.stringify(player1));

  return {
    props: {
      _id: currentGame.players.player1._id,
      email: email,
      pseudo: currentGame.players.player1.pseudo,
      appKey: APP_KEY,
      cluster: APP_CLUSTER,
    },
  };
};

const DisplayNames: React.FC<{ channel?: Channel }> = ({ channel }) => {
  const [names, setNames] = React.useState([]);
  // console.log("names ligne 38", names);
  useEffect(() => {
    if (channel) {
      channel.bind("test-event", (data: { pseudo: never }) => {
        setNames((currentNames) => {
          if (currentNames.includes(data.pseudo) === false) {
            return [...currentNames, data.pseudo];
          }
          return currentNames;
        });
        // console.log("names ligne 48", names);
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
}> = ({ _id, pseudo, email, appKey, cluster }) => {
  const [channel, setChannel] = React.useState<Channel>();
  const [loading, setLoading] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState("facile");

  console.log("id index", _id);

  useEffect(() => {
    const pusher = new Pusher(`${appKey}`, {
      cluster: `${cluster}`,
    });

    const channel = pusher.subscribe("tests");
    setChannel(channel);
  }, [cluster, appKey]);

  const handler = () => {
    setLoading(true);
    fetch(`/api/pusher/pusher?pseudo=${pseudo}&id=${_id}`).then(() =>
      setLoading(false)
    );
  };

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
    };

    await fetch("/api/games/generateGameMulti", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(temp),
    }).then((result) => router.push(result.url));
  };

  return (
    <Layout>
      <div className="container">
        <h3>Configurer la partie :</h3>
        <br />
        <DisplayNames channel={channel} />
        <br />
        <Button onClick={handler} disabled={loading}>
          Join party
        </Button>
        <br />
        <br />
        <br />
        <br />
        <br />
        <Button onClick={handleSubmit}>Lancer la partie &rarr;</Button>
      </div>
    </Layout>
  );
};

export default GameConfig;
