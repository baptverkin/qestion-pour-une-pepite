import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, Nav, Button } from "react-bootstrap";
import { Layout } from "../components/layout";
import { getDatabase } from "../src/database";
import styles from "../styles/Home.module.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import router from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res);
  const email = session?.user.email;

  const mongodb = await getDatabase();
  const response = await mongodb
    .db()
    .collection("users")
    .findOne({ email: email });
  const usersDb = JSON.parse(JSON.stringify(response));

  return {
    props: {
      _id: usersDb._id,
      pseudo: usersDb.pseudo,
      victories: usersDb.victories,
      playedGames: usersDb.playedGames,
      email: usersDb.email,
    },
  };
};

const Profile: React.FC<{
  _id: ObjectId;
  pseudo: string;
  victories: number;
  playedGames: number;
  email: string;
}> = ({ _id, pseudo, victories, playedGames, email }) => {
  return (
    <>
      <Layout>
        {/* {router.reload()} */}
        <div className="container">
          <h2>
            Bonjour {pseudo}&nbsp;&nbsp;&nbsp;
            <Link href="/form" passHref>
              <Image
                className="edit-pseudo"
                src="/images/pencil-icon.png"
                alt="changer pseudo"
                width="20"
                height="20"
              />
            </Link>
          </h2>

          <ul>
            <h4>{playedGames} parties</h4>
            <h4>{victories} victoires</h4>
            <h4>Classement général : 3e</h4>
          </ul>
        </div>
        <br />

        <h3 className={styles.title}>Choisis ton mode de jeu</h3>
        <br></br>
        <Card
          className="cardProfile"
          style={{
            // textAlign: "center",
            marginLeft: "100px",
            marginRight: "100px",
          }}
        >
          <Tabs defaultActiveKey="first">
            <Tab eventKey="first" title="Général" className="container">
              <h5 style={{ marginTop: "1em" }}>Jeu Complet : </h5>
              <p style={{ marginBottom: "1em" }}>
                Défie tes amis ou l&apos;IA dans une partie en 3 manches et
                devient le champion <br></br>9 points gagnants &rarr; 4 à la
                suite &rarr; Face à face
              </p>
            </Tab>
            <Tab eventKey="second" title="Règles" className="container">
              <h5 style={{ marginTop: "1em" }}>Règles du jeu : </h5>
              <p style={{ marginBottom: "1em" }}>
                Quatre candidats sont en lice et doivent, lors de 3 manches
                successives, répondre à des questions de culture générale. Le
                concurrent le moins performant est éliminé à la fin de chaque
                manche et le gagnant est le candidat remportant la dernière
                manche, ce qui lui donne le droit de rejouer à l&apos;émission
                suivante.
              </p>
            </Tab>
          </Tabs>
          <Link href="#" passHref={true}>
            <Button
              variant="primary"
              style={{
                textAlign: "center",
                marginLeft: "40%",
                marginRight: "40%",
                marginBottom: "1em",
              }}
            >
              Commencez à jouer &rarr;
            </Button>
          </Link>
        </Card>
        <br></br>

        <h3 className={styles.title}>Entrainement</h3>
        <br></br>

        <div className="column">
          <div
            className="row"
            style={{
              textAlign: "center",
              marginLeft: "100px",
              marginRight: "100px",
              justifyContent: "center",
              marginBottom: "1em",
            }}
          >
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src="/images/neuf-points-gagnants.jpeg" />
              <Card.Body>
                <Card.Title>9 Points gagnants</Card.Title>
                <Card.Text>
                  Rapidité ! Les 3 premiers joueurs à obtenir 9 points se
                  qualifient
                </Card.Text>
                <Link href="#" passHref={true}>
                  <Button variant="primary">Commencez à jouer &rarr;</Button>
                </Link>
              </Card.Body>
            </Card>

            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src="/images/quatreàlasuite.jpg" />
              <Card.Body>
                <Card.Title>4 à la suite </Card.Title>
                <Card.Text>
                  Celui qui répond aux plus de questions successivement se
                  qualifie
                </Card.Text>
                <Link href="#" passHref={true}>
                  <Button variant="primary">Commencez à jouer &rarr;</Button>
                </Link>
              </Card.Body>
            </Card>

            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src="/images/faceàface.jpg" />
              <Card.Body>
                <Card.Title>Face à face</Card.Title>
                <Card.Text>Le premier à 12 points remporte la partie</Card.Text>
                <Link href="#" passHref={true}>
                  <Button variant="primary">Commencez à jouer &rarr;</Button>
                </Link>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Profile;
