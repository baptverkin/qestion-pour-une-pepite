import { GetServerSideProps } from "next";
import Pusher, { Channel } from "pusher-js";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { Layout } from "../../components/layout";

export const getServerSideProps: GetServerSideProps = async () => {
  const APP_KEY = process.env.APP_KEY;
  const APP_CLUSTER = process.env.APP_CLUSTER;
  return {
    props: {
      appKey: APP_KEY,
      cluster: APP_CLUSTER,
    },
  };
};

const DisplayNames: React.FC<{ channel?: Channel }> = ({ channel }) => {
  const [names, setNames] = React.useState("");
  useEffect(() => {
    if (channel) {
      channel.bind("test-event", (data: any) => {
        console.log(data);
        setNames(names + data.name);
      });
      return () => {
        channel.unbind("test-event");
      };
    }
  }, [channel, names]);
  return <li>{names}</li>;
};

const Tests: React.FC<{
  appKey: string;
  cluster: string;
}> = ({ appKey, cluster }) => {
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
    fetch("/api/pusher/pusher").then(() => setLoading(false));
  };

  return (
    <Layout>
      <div className="container">
        <DisplayNames channel={channel} />
        <br />
        <Button onClick={handler} disabled={loading}>
          Click me
        </Button>
      </div>
    </Layout>
  );
};

export default Tests;
