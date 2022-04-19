import { GetServerSideProps } from "next";
import Pusher, { Channel } from "pusher-js";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { Layout } from "../../components/layout";
import { getSession } from "@auth0/nextjs-auth0";
import { getDatabase } from "../../src/database";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res);
  const email = session?.user.email;
  const mongodb = await getDatabase();
  const response = await mongodb
    .db()
    .collection("users")
    .findOne({ email: email });
  const userDB = JSON.parse(JSON.stringify(response));

  const APP_KEY = process.env.APP_KEY;
  const APP_CLUSTER = process.env.APP_CLUSTER;
  return {
    props: {
      appKey: APP_KEY,
      cluster: APP_CLUSTER,
      pseudo: userDB.pseudo,
    },
  };
};

const DisplayNames: React.FC<{ channel?: Channel }> = ({ channel }) => {
  const [names, setNames] = React.useState([]);
  useEffect(() => {
    if (channel) {
      channel.bind("test-event", (data: { pseudo: never }) => {
        setNames((currentNames) => {
          if (currentNames.includes(data.pseudo) === false) {
            return [...currentNames, data.pseudo];
          }
          return currentNames;
        });
      });
      return () => {
        channel.unbind("test-event");
      };
    }
  }, [channel, names]);
  return (
    <div>
      {names.map((name) => {
        return <li key={Math.random()}>{name}</li>;
      })}
    </div>
  );
};

const Tests: React.FC<{
  appKey: string;
  cluster: string;
  pseudo: string;
}> = ({ appKey, cluster, pseudo }) => {
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
    fetch(`/api/pusher/pusher?pseudo=${pseudo}`).then(() => setLoading(false));
  };

  return (
    <Layout>
      <div className="container">
        <DisplayNames channel={channel} />
        <br />
        <Button onClick={handler} disabled={loading}>
          Join party
        </Button>
      </div>
    </Layout>
  );
};

export default Tests;
