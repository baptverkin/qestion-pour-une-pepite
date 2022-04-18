import { GetServerSideProps } from "next";
import Pusher from "pusher-js";
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

const Tests: React.FC<{
  appKey: string;
  cluster: string;
}> = ({ appKey, cluster }) => {
  const [names, setNames] = React.useState("");
  useEffect(() => {
    const pusher = new Pusher(`${appKey}`, {
      cluster: `${cluster}`,
    });

    const channel = pusher.subscribe("tests");
    channel.bind("test-event", (data: any) => {
      setNames(data.name);
    });
  }, [cluster, appKey]);

  return (
    <Layout>
      <div className="container">
        {names}
        <br />
        <Button href="/api/pusher/pusher">Click me</Button>
      </div>
    </Layout>
  );
};

export default Tests;
